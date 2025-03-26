require("dotenv").config();
const User = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userValidationSchema = require("../validation/user.validate");
const { totp } = require("otplib");
const { sendEmail, sendSms } = require("./../sent-otp-funcs/sent-otp-funcs");
const Region = require("../models/region.model");
const Comment = require('../models/comment.model')

totp.options = { step: 1000, digits: 6 };

function genToken(user) {
  let token = jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.TOKEN_EXPIRY }
  );
  return token;
}

function genRefreshToken(user) {
  return jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRY }
  );
}

// Register with phone User
const register = async (req, res) => {
  try {
    const { error } = userValidationSchema.validate(req.body);
    if (error) {
      console.log(error)
      return res.status(400).json({ error: error.details[0].message });
    }

    let { phone, email, password, region_id,role, fullname, ...rest } = req.body;

    let userEmail = await User.findOne({ where: { email } });
    if (userEmail) {
      return res.status(400).json({ message: "Email already exists" });
    }

    let userPhone = await User.findOne({ where: { phone } });
    if (userPhone) {
      return res.status(400).json({ message: "Phone already exists" });
    }

    let usernameFound = await User.findOne({ where: { fullname } });
    if (usernameFound) {
      return res.status(400).json({
        message: "Fullname already exists. Please change your username..",
      });
    }

    if (!["user", "ceo"].includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    };

    if(!region_id) return res.status(400).json({message: "region_id is required"});

    let region = await Region.findByPk(region_id);
    if (!region) return res.status(404).json({ message: "region not found" });

    let hash = bcrypt.hashSync(password, 10);
    let newUser = await User.create({
      ...rest,
      fullname,
      region_id,
      email,
      role,
      phone,
      password: hash,
    });

    res.json(newUser);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
};

const createAdmin = async (req, res) => {
  try {
    const { error } = userValidationSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    let { phone, email, password, fullname, role, ...rest } =
      req.body;

    if (!["admin", "superadmin"].includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    let userEmail = await User.findOne({ where: { email } });
    if (userEmail)
      return res.status(400).json({ message: "Email already exists" });

    let userPhone = await User.findOne({ where: { phone } });
    if (userPhone)
      return res.status(400).json({ message: "Phone already exists" });

    let usernameFound = await User.findOne({ where: { fullname } });
    if (usernameFound) {
      return res
        .status(400)
        .json({ message: "Fullname already exists. Please choose another." });
    }

    let hash = bcrypt.hashSync(password, 10);

    let newAdmin = await User.create({
      ...rest,
      fullname,
      email,
      phone,
      password: hash,
      role,
    });

    res.status(201).json(newAdmin);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
};

const deleteAdmin = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ error: "Admin not found" });
    }
    await user.destroy();
    res.status(200).json({ message: "Admin deleted successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
};

const login = async (req, res) => {
  try {
    let { fullname, password } = req.body;
    if (!fullname || !password) {
      return res
        .status(400)
        .json({ message: "Please enter fullname and password..." });
    }

    let user = await User.findOne({ where: { fullname } });

    if (
      !user &&
      fullname === process.env.ADMIN_FULLNAME &&
      password === process.env.ADMIN_PASSWORD
    ) {
      let hashedPassword = bcrypt.hashSync(password, 10);

      user = await User.create({
        fullname: process.env.ADMIN_FULLNAME,
        email: process.env.ADMIN_EMAIL,
        password: hashedPassword,
        phone: process.env.ADMIN_PHONE,
        image: process.env.ADMIN_IMAGE,
        role: process.env.ADMIN_ROLE,
      });
    }

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // Parolni tekshirish
    let isMatch = bcrypt.compareSync(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    let access_token = genToken(user);
    let refresh_token = genRefreshToken(user);

    res.json({ access_token, refresh_token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

const sendOtp = async (req, res) => {
  try {
    let { email, phone } = req.body;
    if (!email || !phone) {
      return res
        .status(400)
        .json({ message: "please enter the phone and email" });
    }

    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      return res
        .status(400)
        .json({ message: "the format of email is incorrect" });

    if (phone && !/^\d{9}$/.test(phone))
      return res.status(400).json({
        message:
          "the amount of numbers should be at least 9(example: 936005412)",
      });

    if (email && (await User.findOne({ where: { email } })))
      return res.status(409).json({ message: "Email already exists" });

    if (phone && (await User.findOne({ where: { phone } })))
      return res.status(409).json({ message: "Phone already exists" });

    const token = totp.generate(email + process.env.TOTP_SECRET);
    console.log(token);

    // await sendSms(phone,token);
    await sendEmail(email, token);
    return res.json({
      message: `The otp is sent to your email and phone.[${token}]`,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ err: error.message });
  }
};

const verify = async (req, res) => {
  let { email, otp } = req.body;
  try {
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      return res
        .status(400)
        .json({ message: "the format of email is incorrect" });

    let user = await User.findOne({ where: { email } });
    if (user) {
      return res.status(409).json({ message: "User already exists" });
    }

    let match = totp.verify({
      token: otp,
      secret: email + process.env.TOTP_SECRET,
    });
    console.log(otp, email);
    res.json({ verified: match });
  } catch (error) {
    console.log(err);
    res.status(500).json({ error: error.message });
  }
};

// Get All Users
const getUsers = async (req, res) => {
  try {
      const { page, limit, sortField, sortOrder, region_id } = req.query;

      const queryOptions = {
          include: [
              { model: Comment, attributes: ["id", "text", "star"] }
          ],
          where: {},
          order: [],
          attributes: { exclude: ['password'] },
      };

      if (page && limit) {
          queryOptions.limit = parseInt(limit);
          queryOptions.offset = (parseInt(page) - 1) * parseInt(limit);
      }

      if (sortField && sortOrder) {
          queryOptions.order.push([
              sortField,
              sortOrder.toUpperCase() === "DESC" ? "DESC" : "ASC",
          ]);
      } else {
          queryOptions.order.push(["fullname", "ASC"]);
      }

      if (region_id) {
          queryOptions.where.region_id = region_id;
      }

      const users = await User.findAndCountAll(queryOptions);

      const response = {
          data: users.rows,
          total: users.count,
      };

      if (page && limit) {
          response.page = parseInt(page);
          response.totalPages = Math.ceil(users.count / limit);
      }

      res.json(response);
  } catch (error) {
      console.log(error);
      res.status(500).json({ message: error.message });
  }
};

// Get User by ID
const getUserById = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      include: { model: Region },
    });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json(user);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
};

// Me
const me = async (req, res) => {
  try {
    console.log(req.userId);
    let data = await User.findByPk(req.userId, { include: Region });
    res.json(data);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};
// get refresh token
const refresh = async (req, res) => {
  try {
    let { refresh_token } = req.body;

    if (!refresh_token)
      return res.status(400).json({ message: "refresh_token is not provided" });

    let data = jwt.verify(refresh_token, "secret_boshqa");
    let token = genToken(data.id);
    res.json({ token });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Invalid refresh token" });
  }
};

// Update User
const { Op } = require("sequelize");

const updateUser = async (req, res) => {
  try {
    const { error } = userValidationSchema
      .fork(Object.keys(req.body), (schema) => schema.required())
      .validate(req.body, { abortEarly: false });

    if (error) {
      return res
        .status(400)
        .json({ error: error.details.map((err) => err.message) });
    }

    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (user.role === "user" && req.body.role) {
      return res.status(403).json({ error: "You cannot update role" });
    }

    if (req.body.fullname) {
      const fullnameExists = await User.findOne({
        where: { fullname: req.body.fullname, id: { [Op.ne]: user.id } },
      });
      if (fullnameExists) {
        return res.status(400).json({ error: "Fullname must be unique" });
      }
    }

    if (req.body.email) {
      const emailExists = await User.findOne({
        where: { email: req.body.email, id: { [Op.ne]: user.id } },
      });
      if (emailExists) {
        return res.status(400).json({ error: "Email must be unique" });
      }
    }

    if (req.body.phone) {
      const phoneExists = await User.findOne({
        where: { phone: req.body.phone, id: { [Op.ne]: user.id } },
      });
      if (phoneExists) {
        return res.status(400).json({ error: "Phone must be unique" });
      }
    }

    await user.update(req.body, { fields: Object.keys(req.body) });

    res.status(200).json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

// Delete User
const deleteUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    await user.destroy();
    res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
};

const resetPassword = async (req, res) => {
  try{
    const {newpassword} = req.body
    if(!newpassword){
      return res.status(400).json({message: "Please provide you new password password"})
    }
    if(typeof newpassword !== "string"){
      return res.status(400).json({message: "Password must be a string"})
    }
    if(newpassword.length < 8){
      return res.status(400).json({message: "Your password should be at least 8 characters long"})
    }
    let user_id = req.userId

    let user = await User.findByPk(user_id)
    if(!user){
      return res.status(404).json({message: "User not found"})
    }
    const hashed = await bcrypt.hash(newpassword, 10)
    user.password = hashed
    await user.save()
    res.status(200).json({message: "Password reset successfully"})
  }catch(error){
    console.log(error)
    res.status(500).json({error: error.message})
  }
}

module.exports = {
  login,
  refresh,
  register,
  verify,
  sendOtp,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  me,
  createAdmin,
  deleteAdmin,
  resetPassword
};

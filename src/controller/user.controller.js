require("dotenv").config();
const User = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userValidationSchema = require("../validation/user.validate");
const { totp } = require("otplib");
const { sendEmail, sendSms } = require("./../sent-otp-funcs/sent-otp-funcs");
const Region = require("../models/region.model");
const Comment = require('../models/comment.model');
const DeviceDetector = require("device-detector-js");
const deviceDetector = new DeviceDetector();
const logger = require('../config/logger')

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
    logger.info("registering user", {
      body: req.body
    })
    const { error } = userValidationSchema.validate(req.body);
    if (error) {
      logger.warn("user registration failed: validation error", {
        error: error.details[0].message
      })
      return res.status(400).json({ error: error.details[0].message });
    }

    let { phone, email, password, region_id,role, fullname, ...rest } = req.body;

    let userEmail = await User.findOne({ where: { email } });
    if (userEmail) {
      logger.warn("user registration failed: email already exists", {
        email
      })
      return res.status(400).json({ message: "Email already exists" });
    }

    let userPhone = await User.findOne({ where: { phone } });
    if (userPhone) {
      logger.warn("user registration failed: phone already exists", {phone})
      return res.status(400).json({ message: "Phone already exists"});
    }

    let usernameFound = await User.findOne({ where: { fullname } });
    if (usernameFound) {
      logger.warn("User registration failed: Fullname already exists", {
        fullname
      });
      return res.status(400).json({
        message: "Fullname already exists. Please change your username..",
      });
    }

    if (!["user", "ceo"].includes(role)) {
      logger.warn("User registration failed: Invalid role", {
        role,
        userId: req.userId || "unauthenticated",
      });
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

    logger.info("User registered successfully", {
      userId: newUser.id,
      email,
      role,
    });

    res.json(newUser);
  } catch (err) {
    throw err
  }
};

const createAdmin = async (req, res) => {
  try {
    logger.info("Creating admin", {
      body: { ...req.body, password: "[REDACTED]" },
      userId: req.userId || "unauthenticated",
    });
    const { error } = userValidationSchema.validate(req.body);
    if (error) {
      logger.warn("Admin creation failed: Validation error", {
        error: error.details[0].message,
        userId: req.userId || "unauthenticated",
      });
      return res.status(400).json({ error: error.details[0].message });
    }

    let { phone, email, password, fullname, role, ...rest } =
      req.body;

    if (!["admin", "superadmin"].includes(role)) {
      logger.warn("Admin creation failed: Invalid role", {
        role,
        userId: req.userId || "unauthenticated",
      });
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
    logger.info("Admin created successfully", {
      adminId: newAdmin.id,
      email,
      role,
      userId: req.userId || "unauthenticated",
    });

    res.status(201).json(newAdmin);
  } catch (err) {
    throw err
  }
};

const deleteAdmin = async (req, res) => {
  try {
    logger.info("Deleting admin", {
      adminId: req.params.id,
      userId: req.userId || "unauthenticated",
    });
    const user = await User.findByPk(req.params.id);
    if (!user) {
      logger.warn("Admin deletion failed: Admin not found", {
        adminId: req.params.id,
        userId: req.userId || "unauthenticated",
      });
      return res.status(404).json({ error: "Admin not found" });
    }
    logger.info("Admin deleted successfully", {
      adminId: req.params.id,
      userId: req.userId || "unauthenticated",
    });
    await user.destroy();
    res.status(200).json({ message: "Admin deleted successfully" });
  } catch (err) {
    throw err
  }
};

const login = async (req, res) => {
  try {
    logger.info("User login attempt", {
      body: { ...req.body, password: "[REDACTED]" },
      userId: req.userId || "unauthenticated",
    });
    let { fullname, password, ip_id } = req.body;
    if (!fullname || !password) {
      logger.warn("Login failed: Missing fullname or password", {
        userId: req.userId || "unauthenticated",
      });
      return res
        .status(400)
        .json({ message: "Please enter fullname and password..." });
    }

    let user = await User.findOne({ where: { fullname } });
    let device = deviceDetector.parse(req.headers["user-agent"]);

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
    logger.info("Default admin created during login", {
      userId: user.id,
      role: user.role,
    });

    if (!user) {
      logger.warn("Login failed: User not found", {
        fullname,
        userId: req.userId || "unauthenticated",
      });
      return res.status(400).json({ message: "User not found" });
    }

    let userSession = await Session.findOne({ where: { user_id: user.id } });
    let ip = await Session.findOne({ where: { ip_id } });

    // Parolni tekshirish
    let isMatch = bcrypt.compareSync(password, user.password);
    if (!isMatch) {
      logger.warn("Login failed: Invalid password", {
        fullname,
        userId: req.userId || "unauthenticated",
      });
      return res.status(400).json({ message: "Invalid password" });
    }

    let access_token = genToken(user);
    let refresh_token = genRefreshToken(user);

    if (!ip || !userSession) {
      let newSession = await Session.create({
        user_id: user.id,
        ip_id,
        device_data: device,
      });
      logger.info("User logged in successfully with new session", {
        userId: user.id,
        sessionId: newSession.id,
      });
      return res.json({ access_token,refresh_token,newSession });
    }
    logger.info("User logged in successfully", {
      userId: user.id,
    });
    res.json({ access_token, refresh_token });

  } catch (error) {
    throw err
  }
};

const sendOtp = async (req, res) => {
  try {
    logger.info("Sending OTP", {
      body: req.body,
      userId: req.userId || "unauthenticated",
    });
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
    logger.info("OTP sent successfully", {
      email,
      phone,
      userId: req.userId || "unauthenticated",
    });
    return res.json({
      message: `The otp is sent to your email and phone.[${token}]`,
    });
  } catch (error) {
    throw error
  }
};

const verify = async (req, res) => {
  let { email, otp } = req.body;
  try {
    logger.info("Verifying OTP", {
      body: req.body,
      userId: req.userId || "unauthenticated",
    });
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
    logger.info("OTP verification completed", {
      email,
      verified: match,
      userId: req.userId || "unauthenticated",
    });
    res.json({ verified: match });
  } catch (error) {
    throw error
  }
};

// Get All Users
const getUsers = async (req, res) => {
  try {
    logger.info("Fetching users", {
      query: req.query,
      userId: req.userId || "unauthenticated",
    });
      const { page = 1, limit = 10, sortField, sortOrder, region_id } = req.query;

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
      logger.info("Users fetched successfully", {
        total: users.count,
        userId: req.userId || "unauthenticated",
      });
      res.json(response);
  } catch (error) {
    throw error
  }
};

// Get User by ID
const getUserById = async (req, res) => {
  try {
    logger.info("Fetching user by ID", {
      userId: req.params.id,
      requesterId: req.userId || "unauthenticated",
    });
    const user = await User.findByPk(req.params.id, {
      include: { model: Region },
    });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    logger.info("User fetched successfully", {
      userId: req.params.id,
      requesterId: req.userId || "unauthenticated",
    });
    res.status(200).json(user);
  } catch (err) {
    throw err
  }
};

// Me
const me = async (req, res) => {
  try {
    logger.info("Fetching user profile (me)", {
      userId: req.userId,
    });
    console.log(req.userId);
    let data = await User.findByPk(req.userId, { include: Region });
    logger.info("User profile fetched successfully", {
      userId: req.userId,
    });
    res.json(data);
  } catch (error) {
    throw error
  }
};
// get refresh token
const refresh = async (req, res) => {
  try {
    logger.info("Refreshing token", {
      userId: req.userId || "unauthenticated",
    });
    let { refresh_token } = req.body;

    if (!refresh_token)
      return res.status(400).json({ message: "refresh_token is not provided" });

    let data = jwt.verify(refresh_token, "secret_boshqa");
    logger.info("Token refreshed successfully", {
      userId: data.id,
    });
    let token = genToken(data);
    res.json({ token });
  } catch (error) {
    logger.warn("Token refresh failed: Invalid refresh token", {
      userId: req.userId || "unauthenticated",
    });
    return res.status(400).json({ message: "Invalid refresh token" });
  }
}


// Update User
const { Op } = require("sequelize");
const Session = require("../models/session.model");

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
    logger.info("User updated successfully", {
      userId: req.params.id,
      requesterId: req.userId || "unauthenticated",
    });
    res.status(200).json(user);
  } catch (err) {
    throw err
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
    logger.info("User deleted successfully", {
      userId: req.params.id,
      requesterId: req.userId || "unauthenticated",
    });
    res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    throw err
  }
};

const resetPassword = async (req, res) => {
  try{
    logger.info("Resetting password", {
      userId: req.userId,
    });
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
    logger.info("Password reset successfully", {
      userId: req.userId,
    });
    res.status(200).json({message: "Password reset successfully"})
  }catch(error){
    throw err
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

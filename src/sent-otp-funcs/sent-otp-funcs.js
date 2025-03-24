require("dotenv").config();
const nodemailer = require("nodemailer");
const axios = require("axios");
const api = axios.create({
  baseURL: process.env.ESKIZ_API_URL,
  headers: {
    Authorization: `Bearer ${process.env.ESKIZ_API_TOKEN}`,
  },
});

async function sendSms(tel, otp) {
  try {
    api.post("message/sms/send", {
      mobile_phone: tel,
      message: "Bu Eskiz dan test",
      from: "4546"
    });
    console.log("sended", otp, tel);
  } catch (err) {
    console.log(err);
  }
};

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, 
    pass: process.env.EMAIL_PASS,
  },
});

async function sendEmail(email, otp) {
    console.log("salom");
    await transporter.sendMail({
        to: email,
        subject: "Test Project",
        from: "odilbek3093@gmail.com",
        text: `your one time password is ${otp}`,
    });
  console.log("sended to email" , otp);
};

module.exports = {sendEmail, sendSms};

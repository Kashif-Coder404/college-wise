import User from "../models/User.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";
// Signup Controller
export const signupUser = async (req, res) => {
  try {
    const { fullName, email, password, course, semester } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email is already registered. Please log in.",
      });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.APP_PASSWORD,
      },
      connectionTimeout: 10000,
      greetingTimeout: 10000,
      socketTimeout: 10000,
    });

    const mailOptions = {
      from: `"CollegeWise" <${process.env.EMAIL}>`,
      to: email,
      subject: "Verification OTP - CollegeWise",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e1e1e1; border-radius: 10px;">
          <h2 style="color: #2563eb; text-align: center;">CollegeWise Account Verification</h2>
          <p>Hello ${fullName},</p>
          <p>Thank you for signing up for CollegeWise! Please use the following One-Time Password (OTP) to verify your email address. This OTP is valid for 10 minutes:</p>
          <div style="text-align: center; margin: 30px 0;">
            <span style="font-size: 32px; font-weight: bold; color: #2563eb; tracking-widest: 4px; border: 2px dashed #2563eb; padding: 10px 20px; border-radius: 8px; display: inline-block; font-family: monospace;">${otp}</span>
          </div>
          <p>If you did not initiate this request, you can safely ignore this email.</p>
          <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
          <p style="font-size: 12px; color: #888; text-align: center;">This is an automated email. Please do not reply.</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    const signupToken = jwt.sign(
      {
        signupData: { fullName, email, password, course, semester },
        otp,
        purpose: "email-verification",
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "10m",
      },
    );

    res.status(200).json({
      success: true,
      otpSent: true,
      signupToken,
      message: "Verification OTP sent to your email successfully",
    });
  } catch (error) {
    console.error("Error in signupUser:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Login Controller
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    if (user.password !== password) {
      return res.status(401).json({
        success: false,
        message: "Invalid Credentials",
      });
    }
    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      },
    );

    res.status(200).json({
      success: true,
      token,
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Forgot Password Controller
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User with this email does not exist",
      });
    }

    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        purpose: "password-reset",
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      },
    );

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.APP_PASSWORD,
      },
      connectionTimeout: 10000,
      greetingTimeout: 10000,
      socketTimeout: 10000,
    });

    const origin = req.headers.origin || "http://localhost:3000";
    const resetUrl = `${origin}/reset-password?token=${token}`;

    const mailOptions = {
      from: `"CollegeWise" <${process.env.EMAIL}>`,
      to: user.email,
      subject: "Password Reset Request - CollegeWise",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e1e1e1; border-radius: 10px;">
          <h2 style="color: #2563eb; text-align: center;">CollegeWise Password Reset</h2>
          <p>Hello ${user.fullName},</p>
          <p>We received a request to reset the password for your CollegeWise account. If you did not make this request, you can safely ignore this email.</p>
          <p>Otherwise, you can reset your password using the link below (expires in 1 hour):</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Reset Password</a>
          </div>
          <p>Or copy and paste this URL into your browser:</p>
          <p style="word-break: break-all; color: #555;">${resetUrl}</p>
          <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
          <p style="font-size: 12px; color: #888; text-align: center;">This is an automated email. Please do not reply.</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({
      success: true,
      message: "Reset link sent to your email successfully",
    });
  } catch (error) {
    console.error("Error in forgotPassword:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Reset Password Controller
export const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Token and new password are required",
      });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired token",
      });
    }

    if (decoded.purpose !== "password-reset") {
      return res.status(400).json({
        success: false,
        message: "Invalid token usage",
      });
    }

    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    user.password = newPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Password reset successfully",
    });
  } catch (error) {
    console.error("Error in resetPassword:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Verify Signup OTP Controller
export const verifySignupOTP = async (req, res) => {
  try {
    const { signupToken, otp } = req.body;

    if (!signupToken || !otp) {
      return res.status(400).json({
        success: false,
        message: "Signup token and OTP are required",
      });
    }

    let decoded;
    try {
      decoded = jwt.verify(signupToken, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(400).json({
        success: false,
        message: "Verification link expired or invalid. Please sign up again.",
      });
    }

    if (decoded.purpose !== "email-verification") {
      return res.status(400).json({
        success: false,
        message: "Invalid token usage",
      });
    }

    if (decoded.otp !== otp.trim()) {
      return res.status(400).json({
        success: false,
        message: "Incorrect OTP. Please check your email and try again.",
      });
    }

    const { fullName, email, password, course, semester } = decoded.signupData;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email is already registered. Please log in.",
      });
    }

    const newUser = await User.create({
      fullName,
      email,
      password,
      course,
      semester,
    });

    const token = jwt.sign(
      {
        id: newUser._id,
        email: newUser.email,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      },
    );

    res.status(201).json({
      success: true,
      token,
      user: {
        _id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        course: newUser.course,
        semester: newUser.semester,
      },
      message: "Account verified and registered successfully!",
    });
  } catch (error) {
    console.error("Error in verifySignupOTP:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

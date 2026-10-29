import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { nanoid } from "nanoid";

import HttpError from "../helpers/HttpError.js";
import sendEmail from "../helpers/sendEmail.js";
import User from "../models/User.js";
import {
  userSignupSchema,
  userSigninSchema,
  userEmailSchema,
} from "../models/User.js";

const { JWT_SECRET, BASE_URL, FRONTEND_URL } = process.env;

const signup = async (req, res, next) => {
  try {
    const { error } = userSignupSchema.validate(req.body);
    if (error) {
      throw HttpError(400, error.message);
    }
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user) {
      throw HttpError(409, "Email already in use");
    }
    const hashPassword = await bcrypt.hash(password, 10);
    const verificationCode = nanoid();
    const newUser = await User.create({
      ...req.body,
      password: hashPassword,
      verificationCode,
    });
    const verifyEmail = {
      to: email,
      subject: "Verify email",
      html: `<table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f4f6f9; table-layout: fixed;">
    <tr>
        <td align="center" style="padding: 40px 10px;">
            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background-color: #ffffff; border-radius: 8px; border: 1px solid #e1e5eb; border-collapse: separate;">
                <tr>
                    <td style="padding: 40px 30px; text-align: left;">
                        
                        <h1 style="margin: 0 0 20px 0; font-family: Arial, Helvetica, sans-serif; font-size: 24px; font-weight: bold; color: #1a202c; line-height: 1.3;">
                            Вітаємо!
                        </h1>
                        
                        <p style="margin: 0 0 16px 0; font-family: Arial, Helvetica, sans-serif; font-size: 16px; color: #4a5568; line-height: 1.6;">
                            Раді вітати вас із успішною реєстрацією на нашому сервісі.
                        </p>
                        
                        <p style="margin: 0 0 30px 0; font-family: Arial, Helvetica, sans-serif; font-size: 16px; color: #4a5568; line-height: 1.6;">
                            Щоб активувати свій акаунт та отримати повний доступ до всіх можливостей, будь ласка, підтвердьте вашу електронну адресу. Для цього натисніть кнопку нижче:
                        </p>
                        
                        <!-- Внутрішня таблиця для кнопки -->
                        <table border="0" cellpadding="0" cellspacing="0" style="margin: 0 0 30px 0; border-collapse: separate;">
                            <tr>
                                <td align="center" bgcolor="#007bff" style="border-radius: 5px; background-color: #007bff;">
                                    <a href="${BASE_URL}/api/auth/verify/${verificationCode}" target="_blank" style="display: inline-block; font-family: Arial, Helvetica, sans-serif; font-size: 16px; font-weight: bold; color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 5px; border: 1px solid #007bff;">
                                        Підтвердити email
                                    </a>
                                </td>
                            </tr>
                        </table>
                        
                    </td>
                </tr>
            </table>
        </td>
    </tr>
</table>
`,
    };
    await sendEmail(verifyEmail);
    res.status(201).json({ username: newUser.username, email: newUser.email });
  } catch (error) {
    next(error);
  }
};

const verify = async (req, res, next) => {
  try {
    const { verificationCode } = req.params;
    const user = await User.findOne({ verificationCode });
    if (!user) {
      return res.redirect(
        `${FRONTEND_URL}/html/email-verify.html?error=invalid_code`,
      );
    }
    await User.findOneAndUpdate(
      { _id: user._id },
      {
        verify: true,
        verificationCode: "",
      },
    );
    // res.json({ message: "Email success" });
    return res.redirect(
      `${FRONTEND_URL}/html/email-verify.html?username=${encodeURIComponent(user.username)}`,
    );
  } catch (error) {
    next(error);
  }
};

const resentVerifyEmail = async (req, res, next) => {
  try {
    const { error } = userEmailSchema.validate(req.body);
    if (error) {
      throw HttpError(400, error.message);
    }
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      throw HttpError(404, "Email not found");
    }
    if (user.verify) {
      throw HttpError(400, "Email already verified");
    }
    const verifyEmail = {
      to: email,
      subject: "Verify email",
      html: `<table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f4f6f9; table-layout: fixed;">
    <tr>
        <td align="center" style="padding: 40px 10px;">
            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background-color: #ffffff; border-radius: 8px; border: 1px solid #e1e5eb; border-collapse: separate;">
                <tr>
                    <td style="padding: 40px 30px; text-align: left;">
                        
                        <h1 style="margin: 0 0 20px 0; font-family: Arial, Helvetica, sans-serif; font-size: 24px; font-weight: bold; color: #1a202c; line-height: 1.3;">
                            Вітаємо!
                        </h1>
                        
                        <p style="margin: 0 0 16px 0; font-family: Arial, Helvetica, sans-serif; font-size: 16px; color: #4a5568; line-height: 1.6;">
                            Раді вітати вас із успішною реєстрацією на нашому сервісі.
                        </p>
                        
                        <p style="margin: 0 0 30px 0; font-family: Arial, Helvetica, sans-serif; font-size: 16px; color: #4a5568; line-height: 1.6;">
                            Щоб активувати свій акаунт та отримати повний доступ до всіх можливостей, будь ласка, підтвердьте вашу електронну адресу. Для цього натисніть кнопку нижче:
                        </p>
                        
                        <!-- Внутрішня таблиця для кнопки -->
                        <table border="0" cellpadding="0" cellspacing="0" style="margin: 0 0 30px 0; border-collapse: separate;">
                            <tr>
                                <td align="center" bgcolor="#007bff" style="border-radius: 5px; background-color: #007bff;">
                                    <a href="${BASE_URL}/api/auth/verify/${verificationCode}" target="_blank" style="display: inline-block; font-family: Arial, Helvetica, sans-serif; font-size: 16px; font-weight: bold; color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 5px; border: 1px solid #007bff;">
                                        Підтвердити email
                                    </a>
                                </td>
                            </tr>
                        </table>
                        
                    </td>
                </tr>
            </table>
        </td>
    </tr>
</table>
`,
    };
    await sendEmail(verifyEmail);
    res.json({ message: "Verify email send success" });
  } catch (error) {
    next(error);
  }
};

const signin = async (req, res, next) => {
  try {
    const { error } = userSigninSchema.validate(req.body);
    if (error) {
      throw HttpError(400, error.message);
    }
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      throw HttpError(401, "Email or password invalid");
    }
    if (!user.verify) {
      throw HttpError(401, "Email is not verify");
    }
    const passwordCompare = await bcrypt.compare(password, user.password);
    if (!passwordCompare) {
      throw HttpError(401, "email or password invalid");
    }
    const { _id: id } = user;
    const payload = {
      id,
    };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "23h" });
    await User.findByIdAndUpdate(id, { token });

    res.json({ token });
  } catch (error) {
    next(error);
  }
};

const getCurrent = async (req, res, next) => {
  try {
    const { username, email } = req.user;
    res.json({
      username,
      email,
    });
  } catch (error) {
    next(error);
  }
};

const logout = async (req, res, next) => {
  try {
    const { _id } = req.user;
    await User.findByIdAndUpdate(_id, { token: "" });
    res.json({
      message: "Signout success",
    });
  } catch (error) {
    next(error);
  }
};

export default {
  signup,
  signin,
  getCurrent,
  logout,
  verify,
  resentVerifyEmail,
};

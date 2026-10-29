import nodemailer from "nodemailer";

const { SMTP_PORT, SMTP_HOST, SMTP_USER, SMTP_PASS } = process.env;

const nodemailerConfig = {
  host: SMTP_HOST,
  port: SMTP_PORT,
  secure: true,
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASS,
  },
};

const transport = nodemailer.createTransport(nodemailerConfig);

// const email = {
//   from: SMTP_USER,
//   to: "genadisema@gmail.com",
//   subject: "TEST",
//   html: "<strong>Test email</strong>",
// };

// transport
//   .sendMail(email)
//   .then(() => console.log("Email send success"))
//   .catch((error) => console.log(error.message));

const sendEmail = async (data) => {
  const email = { ...data, from: SMTP_USER };
  return transport.sendMail(email);
};

export default sendEmail;

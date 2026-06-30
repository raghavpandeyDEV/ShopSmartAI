import 'dotenv/config'
import nodemailer from 'nodemailer'

export const sendOTPMail=(otp , email )=>{
   const transporter = nodemailer.createTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',
  port: 587,          // use 587 (TLS) or 465 (SSL)
  secure: false,      // true for 465, false for 587
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

const mailConfigurations = {
 
    from: process.env.MAIL_USER,

    to: email,

    subject: 'Password Reset OTP',
    
   html:`<p>Youre OTP for passwor reset is : <b>${otp}</b></p>`
};

transporter.sendMail(mailConfigurations, function(error, info){
    if (error) throw Error(error);
    console.log('OTP Sent Successfully');
    console.log(info);
});
}
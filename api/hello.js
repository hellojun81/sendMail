import nodemailer from 'nodemailer';
import multiparty from 'multiparty';
import fs from 'fs';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const form = new multiparty.Form();

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error('Error parsing the files', err);
      return res.status(500).json({ message: 'Error parsing the files' });
    }

    const name = fields.name[0];
    const email = fields.email[0];
    const subject = fields.subject[0];
    const message = fields.message[0];
    const cc = fields.cc ? fields.cc[0] : '';
    const bcc = fields.bcc ? fields.bcc[0] : '';

    if (!name || !email || !subject || !message) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const attachments = files.attachment ? [
      {
        filename: files.attachment[0].originalFilename,
        path: files.attachment[0].path,
      },
    ] : [];

    try {
      const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false, // Secure 설정은 실제 환경에 따라 변경 필요
        auth: {
          user: process.env.SMTP_USER, // 환경변수로 사용자 설정
          pass: process.env.SMTP_PASS, // 환경변수로 패스워드 설정
        },
      });

      const mailOptions = {
        from: process.env.SMTP_USER,
        to: 'taulcontact@gmail.com',
        replyTo: email,
        cc: cc,
        bcc: bcc,
        subject: '[AUBESTUDIO WEB 발신] ' + subject,
        text: message,
        html: `<p>${message}</p>`,
        attachments,
      };

      await transporter.sendMail(mailOptions);

      if (attachments.length > 0) {
        fs.unlinkSync(attachments[0].path);
      }

      res.status(200).json({ message: 'Email sent successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });
}

import { Config } from '../configs/config';
import nodemailer from 'nodemailer';
import { getNodemailerOptions } from '../configs/nodemailer.configs';
import { loggerConfig } from '../configs/logger.configs';

export const sendMail = async (
  config: Config,
  subject: string,
  html: string,
): Promise<void> => {
  const transporter = nodemailer.createTransport(getNodemailerOptions(config));

  const from = config.smtpConfig.username;
  const recipient = config.smtpConfig.recipientEmail;

  const mailOptions = {
    from: from,
    to: recipient,
    subject: subject,
    html: html,
  };

  loggerConfig.info(`Sending mail to - ${recipient}`);

  await transporter
    .sendMail(mailOptions)
    .catch((error) => loggerConfig.error(error));

  // transporter.sendMail(mailOptions, (error, info) => {
  //   if (error) {
  //     loggerConfig.error(error);
  //   } else {
  //     loggerConfig.info('Email sent: ' + info.response);
  //   }
  // });
};

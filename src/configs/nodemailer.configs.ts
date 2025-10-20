import { Config } from './config';
import { Options } from 'nodemailer/lib/smtp-transport';

export function getNodemailerOptions(config: Config): Options {
  return {
    service: config.smtpConfig.service,
    auth: {
      user: config.smtpConfig.username,
      pass: config.smtpConfig.password,
    },
  };
}

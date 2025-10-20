import { NextFunction, Request, Response } from 'express';
import { loggerConfig } from '../configs/logger.configs';
import { verifyHMACToken } from '../utils/token.functions';
import { config } from '../configs/config';
import { sendMail } from '../services/mail.services';

export const saveSubmission = function (
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const data = req.body;

  if (data.website) {
    loggerConfig.info('🤖 BOT-ALERT: Honeypot reached.');
    return res.status(204).end();
  }

  if (!data.token || !verifyHMACToken(data.token, config.tokenSecret)) {
    loggerConfig.info('🤖 BOT-ALERT: Token is invalid.');
    return res.status(400).json({
      success: false,
      message: 'Token is invalid.',
    });
  }

  if (!data.name || !data.email || !data.message) {
    return res.status(400).json({
      success: false,
      message: 'Name, email and message are required.',
    });
  }

  const clean = (({ token, website, ...rest }) => rest)(data);

  sendMail(config, 'New submission', JSON.stringify(clean)).then(() =>
    loggerConfig.info('Send submission email successfully.'),
  );

  res.status(200).send();
};

import { NextFunction, Request, Response } from 'express';
import { generateHMACToken } from '../utils/token.functions';
import { config } from '../configs/config';

export const getToken = function (
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const token = generateHMACToken(
    Math.floor(Date.now() / 1000),
    config.tokenSecret,
  );

  res.send({ token: token });
};

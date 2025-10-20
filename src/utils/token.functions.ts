import crypto from 'crypto';
import { loggerConfig } from '../configs/logger.configs';

export function generateHMACToken(ts: number, tokenSecret: string) {
  const tsString = ts.toString();
  const hmac = crypto.createHmac('sha256', tokenSecret);
  hmac.update(tsString);
  const mac = hmac.digest('base64');
  return `${tsString}:${mac}`;
}

export function verifyHMACToken(token: string, tokenSecret: string) {
  if (!token) return false;

  const parts = token.split(':', 2);
  if (parts.length !== 2) return false;

  const [tsString, sentMac] = parts;
  const ts = parseInt(tsString, 10);
  if (isNaN(ts)) return false;

  const now = Math.floor(Date.now() / 1000);
  const timeDifference = now - ts;

  if (timeDifference < 0 || timeDifference < 2 || timeDifference > 900) {
    loggerConfig.warn(
      `Verify HMAC failed: time difference is ${timeDifference}s`,
    );
    return false;
  }

  const hmac = crypto.createHmac('sha256', tokenSecret);
  hmac.update(tsString);
  const expectedMac = hmac.digest('base64');

  const isMacValid = crypto.timingSafeEqual(
    Buffer.from(expectedMac),
    Buffer.from(sentMac),
  );

  if (!isMacValid) {
    loggerConfig.warn(`Verify HMAC failed: signature is invalid`);
  }
  return isMacValid;
}

import winston from 'winston';

const { combine, timestamp, json } = winston.format;

export const loggerConfig = winston.createLogger({
  level: 'http',
  format: combine(
    timestamp({
      format: 'YYYY-MM-DD hh:mm:ss.SSS A',
    }),
    json(),
  ),
  transports: [new winston.transports.Console()],
});

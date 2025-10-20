import dotenv from 'dotenv';

dotenv.config();

export interface Config {
  port: number;
  nodeEnv: string;
  corsConfig: CorsConfig;
  tokenSecret: string;
  smtpConfig: SmtpConfig;
}

export interface CorsConfig {
  origin: string;
  methods: string;
}

export interface SmtpConfig {
  service: string;
  username: string;
  password: string;
  recipientEmail: string;
}

export const config: Config = {
  port: Number(process.env.PORT) || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  corsConfig: {
    origin: process.env.CLIENT_BASE_URL || 'http://localhost:3000',
    methods: 'GET,HEAD,POST',
  },
  tokenSecret:
    process.env.TOKEN_SECRET ||
    'ein-sehr-geheimnisvoller-schluessel-fuer-den-hmac',
  smtpConfig: {
    service: process.env.SMTP_SERVICE || 'ethereal',
    username: process.env.SMTP_USERNAME || 'therese.schaden73@ethereal.email',
    password: process.env.SMTP_PASSWORD || 'rmM61u4ddhGum9neGg',
    recipientEmail: process.env.RECIPIENT_EMAIL || 'bingo@foo.com',
  },
};

import cors from 'cors';
import express from 'express';
import { loggerConfig } from './configs/logger.configs';
import { getCorsConfig } from './configs/cors.configs';
import morgan from 'morgan';
import { errorHandler } from './middlewares/error.handlers';
import tokenRoutes from './routes/token.routes';
import submissionRoutes from './routes/submission.routes';
import { config } from './configs/config';

const app = express();

app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms', {
    stream: {
      write: (message: string) => loggerConfig.http(message.trim()),
    },
  }),
);

app.use(cors(getCorsConfig(config)));
app.use(express.json());

app.use('/api/submission', submissionRoutes);
app.use('/api/token', tokenRoutes);

app.use(errorHandler);

export default app;

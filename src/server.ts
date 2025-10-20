import app from './app';
import { config } from './configs/config';
import { loggerConfig } from './configs/logger.configs';

app.listen(config.port, () => {
  loggerConfig.info(`Server running on port ${config.port}`);
});

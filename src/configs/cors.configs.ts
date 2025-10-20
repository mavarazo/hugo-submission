import { CorsOptions } from 'cors';
import { Config } from './config';

export function getCorsConfig(config: Config): CorsOptions {
  return {
    origin: config.corsConfig.origin,
    methods: config.corsConfig.methods,
  };
}

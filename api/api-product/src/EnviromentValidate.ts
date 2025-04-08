import * as joi from 'joi';
import logger from './domain/utils/logger';

export default class EnvironmentValidator {
    private envVarsSchema: joi.ObjectSchema;

    constructor() {
        this.envVarsSchema = this.defineSchema()
    }

    private defineSchema(): joi.ObjectSchema {
        return joi.object(
            {
                NODE_ENV: joi.string().valid('development', 'production', 'test').required(),
                PORT: joi.number()
            }
        ).unknown(true);
    }

    public validateEnvironmentVariables(): void {
        const { error } = this.envVarsSchema.validate(process.env);

        if (error) {
            logger.warn('Error validating environment variables:', error.message);
            process.exit(1);
        }

        logger.info('Validating environment variables');
    }
};

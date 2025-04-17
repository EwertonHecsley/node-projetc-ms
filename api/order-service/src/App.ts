import app from ".";
import EnvironmentValidator from "./EnvairomentsValidate";
import getPrismaInstance from "./infra/database/prisma/singleton.prisma";
import logger from "./utils/logger";

export class App {
    private prisma = getPrismaInstance();
    private readonly port = process.env.PORT

    async bootstrap(): Promise<void> {
        await this.prisma.connect()
        this.validateEnv();
        this.startServer();
        this.handleGracefulShutdown();
    }

    private validateEnv(): void {
        const envValidator = new EnvironmentValidator();
        envValidator.validateEnvironmentVariables();
    }

    private startServer(): void {
        app.listen(this.port, () => {
            logger.info(`🟢 Server is running on port ${this.port}`);
        });
    }

    private handleGracefulShutdown(): void {
        process.on('SIGINT', async () => {
            logger.info('🔌 Gracefully shutting down...');
            logger.info('Closing Prisma connection...');
            await this.prisma.disconnect();
            logger.info('✅ Prisma disconnected. Application terminated.');
            process.exit(0);
        });
    }

}
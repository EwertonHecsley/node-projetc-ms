import app from './index';
import EnvironmentValidator from './EnviromentValidate';
import getPrismaInstance from './infra/database/prisma/singleton.prisma';

export class App {
    private prisma = getPrismaInstance();
    private readonly port = process.env.PORT

    async bootstrap(): Promise<void> {
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
            console.log(`🚀 Server is running on port ${this.port}`);
        });
    }

    private handleGracefulShutdown(): void {
        process.on('SIGINT', async () => {
            console.log('\n Finalizando conexão com o banco...');
            await this.prisma.disconnect();
            console.log('✅ Prisma desconectado. Encerrando aplicação.');
            process.exit(0);
        });
    }
}
import PrismaService from "./prisma.service";


let prisma: PrismaService;

function getPrismaInstance(): PrismaService {
    if (!prisma) {
        prisma = new PrismaService();
    }

    return prisma;
}

export default getPrismaInstance;
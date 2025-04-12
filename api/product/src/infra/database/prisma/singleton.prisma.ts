import PrismaService from "./Prisma.service";

let prisma: PrismaService;

function getPrismaInstance(): PrismaService {
    if (!prisma) {
        prisma = new PrismaService();
    }

    return prisma;
}

export default getPrismaInstance;
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function main() {
    const categories = [
        { name: "Literatura" },
        { name: "Ciências Exatas" },
        { name: "Ciências Humanas" },
        { name: "Ciências Biológicas" },
        { name: "Tecnologia" },
        { name: "Artes" },
        { name: "Direito" },
        { name: "Saúde" },
        { name: "Negócios" },
        { name: "Educação" },
        { name: "Religião e Espiritualidade" },
        { name: "Entretenimento" },
    ];

    await prisma.category.createMany({
        data: categories,
        skipDuplicates: true,
    });

    console.log("✅ Categories seed concluído!");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function main() {
    const subCategories = [
        // Literatura
        { name: "Romance" },
        { name: "Fantasia" },
        { name: "Terror" },
        { name: "Ficção Científica" },
        { name: "Poesia" },
        { name: "Biografia" },

        // Ciências Exatas
        { name: "Matemática" },
        { name: "Física" },
        { name: "Química" },
        { name: "Estatística" },

        // Ciências Humanas
        { name: "Filosofia" },
        { name: "Sociologia" },
        { name: "História" },
        { name: "Geografia" },
        { name: "Psicologia" },

        // Ciências Biológicas
        { name: "Botânica" },
        { name: "Zoologia" },
        { name: "Ecologia" },
        { name: "Genética" },

        // Tecnologia
        { name: "Programação" },
        { name: "Redes" },
        { name: "Inteligência Artificial" },
        { name: "Banco de Dados" },

        // Artes
        { name: "Música" },
        { name: "Cinema" },
        { name: "Pintura" },
        { name: "Fotografia" },

        // Direito
        { name: "Direito Civil" },
        { name: "Direito Penal" },
        { name: "Direito Trabalhista" },
        { name: "Direito Constitucional" },

        // Negócios
        { name: "Marketing" },
        { name: "Finanças" },
        { name: "Empreendedorismo" },
        { name: "Gestão" },

        // Educação
        { name: "Pedagogia" },
        { name: "EAD" },
        { name: "Didática" },

        // Religião e Espiritualidade
        { name: "Cristianismo" },
        { name: "Budismo" },
        { name: "Espiritismo" },
        { name: "Islamismo" },
    ];

    await prisma.sub_Category.createMany({
        data: subCategories,
        skipDuplicates: true,
    });

    console.log("✅ Sub-categories seed concluído!");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
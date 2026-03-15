import * as seeds from "./seeds";

async function main() {
    await seeds.seedCategories();
    await seeds.seedSubCategories()
    await seeds.seedAuthors()
    await seeds.seedRoles()
    await seeds.seedWorkers()
    await seeds.seedBooks()
    await seeds.seedSectors()
    await seeds.seedBookcases()
    await seeds.seedBookCopies()
}

main().then(() => console.log("Done!"));
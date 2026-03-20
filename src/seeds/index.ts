import * as seeds from "./seeds";

async function main() {
    await seeds.seedCategories();
    await seeds.seedSubCategories();
    await seeds.seedAuthors();
    await seeds.seedRoles();
    await seeds.seedWorkers();
    await seeds.seedBooks();
    await seeds.seedSectors();
    await seeds.seedBookcases();
    await seeds.seedInstitutions();
    await seeds.seedBookCopies();
    await seeds.seedAuthorsInBooks();
    await seeds.seedWorkerRoles();
}

main().then(() => console.log("Done!"));
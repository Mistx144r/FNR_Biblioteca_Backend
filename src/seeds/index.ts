import { main as seedCategories } from "./seedCategories";
import { main as seedSubCategories } from "./seedSubCategories";

async function main() {
    await seedCategories();
    await seedSubCategories();
}

main().then(() => console.log("Done!"));
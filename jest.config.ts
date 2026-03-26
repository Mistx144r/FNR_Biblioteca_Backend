export default {
  preset: "ts-jest",
  testEnvironment: "node",
  testMatch: ["**/__tests__/**/*.test.ts", "**/__test__/**/*.test.ts"], // os dois por garantia
  setupFiles: ["dotenv/config"],
  transformIgnorePatterns: ["node_modules/(?!@scalar)"]
}
// prisma.config.ts
import "dotenv/config";
import { defineConfig } from "prisma/config";

const user = process.env.DATABASE_USER;
const pass = process.env.DATABASE_PASSWORD;
const host = process.env.DATABASE_HOST;
const port = process.env.DATABASE_PORT;
const name = process.env.DATABASE_NAME;
const url = `mysql://${user}:${pass}@${host}:${port}/${name}`;

export default defineConfig({
    schema: "prisma/schema.prisma",
    migrations: {
        path: "prisma/migrations",
    },
    datasource: {
        url,
    },
});

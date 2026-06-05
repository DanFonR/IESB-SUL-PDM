import { readFile, writeFile } from "node:fs/promises";
import { createInterface } from "node:readline/promises";
import { execSync } from "node:child_process";
import { randomBytes } from "node:crypto";

const rl = createInterface(process.stdin, process.stdout);

async function main() {
    let env = await readFile(".env.example", "utf-8");

    const usuario = await rl.question("Usuário MySQL: ");
    const senha   = await rl.question("Senha MySQL: ");
    const jwt     = randomBytes(32).toString("hex");

    const query = (
        "CREATE DATABASE IF NOT EXISTS "
        + "gestao_financeira CHARACTER SET utf8mb4 "
        + "COLLATE utf8mb4_unicode_ci"
    );

    env = env
        .replaceAll("USUARIO", usuario)
        .replaceAll("SENHA", encodeURIComponent(senha))
        .replace("CHAVE_SECRETA", jwt);

    await writeFile(".env", env);

    try {
        execSync(`mysql -u ${usuario} -p"${senha}" -e "${query}"`, { stdio: "inherit" });
    }
    catch {
        await rl.question(`MySQL não está na PATH, execute "${query}" no MySQL Workbench, e depois dê Enter aqui`);
    }
    try {
        execSync("npx prisma generate", { stdio: "inherit" });
        execSync("npm run prisma:migrate", { stdio: "inherit" });
        execSync("npm run prisma:seed", { stdio: "inherit" });
        console.log("Setup inicial feito");
    }
    catch (err) {
        console.error("Setup falhou, vide o erro");
        console.error(err);
    }
}

main()
    .catch(console.error)
    .finally(() => rl.close());

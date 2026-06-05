import { networkInterfaces } from "os";
import { readFile, writeFile } from "fs/promises";
import { createInterface } from "readline/promises";

const localIp = Object.values(networkInterfaces())
                      .flat()
                      .find(i => i.family === "IPv4" && !i.internal)?.address
                || "localhost";
const rl = createInterface(process.stdin, process.stdout);
const searchVal = /(?<=EXPO.+)10\.0\.2\.2/;

async function main() {
    let env = await readFile(".env.example", "utf-8");
    env = env.split("\n").filter(str => !str.startsWith("#")).join("\n")
              .replace(searchVal, localIp);

    await writeFile(".env", env);
    console.log(".env criado");
}

main().catch(console.error).finally(() => rl.close());

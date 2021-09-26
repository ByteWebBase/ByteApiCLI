#!/usr/bin/env node
import fs from "fs";
import execa from "execa";
import path from "path";
import chalk from "chalk";
import createIndexTemplate from "./createIndexTemplate.js";
import createPackageTemplate from "./createPackageTemplate.js";
import questions from "./questions/index.js";
import { createConfig } from "./config.js";
import { fileURLToPath } from "url";
import { Command } from "commander/esm.mjs";

const program = new Command();

function myParseInt(value, dummyPrevious) {
  // parseInt takes a string and a radix
  const parsedValue = parseInt(value, 10);
  if (isNaN(parsedValue)) {
    throw new commander.InvalidArgumentError("Not a number.");
  }
  return parsedValue;
}

// The previous value passed to the custom processing is used when processing variadic values.
function mySum(value, total) {
  return total + myParseInt(value);
}

program
  .command("login")
  // .argument("<first>", "integer argument", myParseInt)
  // .argument("[second]", "integer argument", myParseInt, 1000)
  .action(() => {
    // console.log('login')
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const koaPath = __dirname + "/oauth/github.js";
    console.log(koaPath); // 当前文件所在的绝对路径。
    execa("node", [koaPath], {
      // cwd: getRootPath(),
      stdio: [2, 2, 2],
    });
    // console.log(`${first} + ${second} = ${first + second}`);
  });

program.command("logout").action(() => {
  console.log(`logout`);
});

program
  .command("build")
  .argument("<path_to.dbml>", "database.dbml")
  .action(async (value) => {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    const answer = await questions();

    const config = createConfig(answer);

    // // 1. 创建项目文件夹
    console.log(chalk.blue(`创建项目文件夹:${config.packageName}`));
    fs.mkdirSync(getRootPath());

    // 2. 创建 index.js
    console.log(chalk.blue(`创建 index.js`));
    fs.writeFileSync(`${getRootPath()}/index.js`, createIndexTemplate(config));
    // 3. 创建 package.json
    console.log(chalk.blue(`创建 package.json`));
    fs.writeFileSync(
      `${getRootPath()}/package.json`,
      createPackageTemplate(config)
    );

    console.log(`${getRootPath()}/framework`);

    fs.mkdirSync(`${getRootPath()}/framework`);
    fs.copyFileSync(
      __dirname + "/template/framework/api.js",
      `${getRootPath()}/framework/api.js`
    );
    fs.copyFileSync(
      __dirname + "/template/framework/loader.js",
      `${getRootPath()}/framework/loader.js`
    );
    fs.copyFileSync(
      __dirname + "/template/framework/router.js",
      `${getRootPath()}/framework/router.js`
    );

    // 4. 安装依赖
    console.log(chalk.blue(`安装依赖`));
    execa("yarn", {
      cwd: getRootPath(),
      stdio: [2, 2, 2],
    });

    function getRootPath() {
      return path.resolve(process.cwd(), config.packageName);
    }
  });

program.parse();

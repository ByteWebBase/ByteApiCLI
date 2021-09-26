import inquirer from "inquirer";
import packageName from "./packageName.js";
import port from "./port.js";
import middleware from "./middleware.js";
import database from "./database.js";

export default () => {
  return inquirer.prompt([
    /* Pass your questions in here */
    packageName(),
    database(),
    port(),
    middleware(),
  ]);
};

import inquirer from "inquirer";
import packageName from "./packageName.js";
import port from "./port.js";
import middleware from "./middleware.js";
import database from "./database.js";
import database_url from "./database_url.js";

export default () => {
  return inquirer.prompt([
    /* Pass your questions in here */
    packageName(),
    port(),
    database(),
    database_url(),
  ]);
};

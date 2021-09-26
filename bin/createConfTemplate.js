import ejs from "ejs";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import prettier from "prettier";

export default (config) => {
  const __dirname = fileURLToPath(import.meta.url);
  const templateCode = fs.readFileSync(
    path.resolve(__dirname, "../template/conf.ejs")
  );
  const code = ejs.render(templateCode.toString(), {
    database: config.database,
  });

  return prettier.format(code, { parser: "babel" });
};

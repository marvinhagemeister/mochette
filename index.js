const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const argv = process.argv.slice(2);
let args = argv;

// Extend tsconfig if necessary
const idx = argv.findIndex(x => x.includes("--ts-config"));
if (idx > -1) {
  const tsConfig = require("./tsconfig.test");
  const tsConfigUser = argv[idx + 1];
  const userConfigPath = path.join(process.cwd(), tsConfigUser);
  tsConfig.extends = "./" + path.relative(__dirname, userConfigPath);
  tsConfig.includes = require(userConfigPath).includes;
  console.log(require(userConfigPath));
  fs.writeFileSync("./tsconfig.tmp.json", JSON.stringify(tsConfig));
  args.splice(idx, 2);
}

const command = "npm run -s start -- " + args.join(" ");
console.log(command);
execSync(command, { stdio: "inherit" });

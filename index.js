#!/usr/bin/env node

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
	fs.writeFileSync("./tsconfig.tmp.json", JSON.stringify(tsConfig));
	args.splice(idx, 2);
}

const command =
	"./node_modules/.bin/cross-env TS_NODE_FILES=true TS_NODE_PROJECT=tsconfig.tmp.json ./node_modules/.bin/_mocha -r ts-node/register -r setup.js --extensions=ts,tsx,js --watch-files src " +
	args.join(" ");
execSync(command, { stdio: "inherit" });

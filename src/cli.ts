#!/usr/bin/env node
import * as mri from "mri";
import * as k from "kleur";
import * as path from "path";
import * as fs from "fs";
import { execSync } from "child_process";
const pkg = require("../package.json");

export function parseArgs(args: string[]) {
	return mri(args, {
		alias: {
			w: "watch",
			h: "help",
			c: "config",
			v: "version",
			r: "require"
		},
		boolean: ["help", "watch", "version"],
		string: ["require", "config"]
	});
}

function showHelp() {
	console.log(`
Usage: ${pkg.name} [options] <...glob paths>

  Options:
    ${k.bold("-c, --config")}   Path to tsconfig.json
    ${k.bold("-w, --watch")}    Restart test run when a file changes
    ${k.bold(
			"-r, --require"
		)}  Require files before running tests (separated by comma)
    ${k.bold("-v, --version")}  Show version number
    ${k.bold("-h, --help")}     Show help

  `);
}

export function exec(args: mri.Argv) {
	if (args.v) {
		console.log(pkg.version);
		return;
	} else if (args.help || !args._.length) {
		showHelp();
		return;
	}

	const requires = ((args.require as string) || "")
		.split(",")
		.filter(Boolean)
		.map(x => `-r ${x}`)
		.join(" ");

	const setup = path.relative(process.cwd(), path.join(__dirname, "setup.ts"));

	// Extend tsconfig if necessary
	const tsConfig = require(path.join(__dirname, "..", "tsconfig.test"));
	if (args.config) {
		const tsConfigUser = args.config;
		const userConfigPath = path.join(process.cwd(), tsConfigUser);
		tsConfig.extends = "./" + path.relative(__dirname, userConfigPath);
		tsConfig.includes = require(userConfigPath).includes;
	}
	tsConfig.compilerOptions.module = "commonjs";
	if (!tsConfig.includes) tsConfig.includes = [];
	tsConfig.includes.push(
		path.relative(process.cwd(), path.join(__dirname, "typings", "global.d.ts"))
	);

	fs.writeFileSync("./tsconfig.tmp.json", JSON.stringify(tsConfig));

	const command = `./node_modules/.bin/cross-env \
        TS_NODE_FILES=true \
        TS_NODE_PROJECT=tsconfig.tmp.json \
      ./node_modules/.bin/_mocha \
        -r ts-node/register \
				-r ${setup} \
				-r ignore-styles \
        ${requires} \
				--watch-extensions=ts,tsx \
				${args.watch ? "--watch" : ""} \
        ${args._.join(" ")}`
		.replace(/[\n\r]/g, " ")
		.replace(/\s+/g, " ");

	try {
		execSync(command, { stdio: "inherit" });
	} catch (err) {
		process.exit(1);
	}
}

exec(parseArgs(process.argv.slice(2)));

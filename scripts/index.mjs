// load using import
import { glob } from "glob";
import * as fs from "fs";
import * as path from "path";
import { persistEntries } from "./utils.mjs";

const __dirname = import.meta.dirname;
const apps = fs.readdirSync(path.resolve(__dirname, "../packages"));

let recordMap = {};
const dists = ["parcel-dist", "esbuild-dist", "rolldown-dist", "rspack-dist"];

for (let i = 0; i < apps.length; i++) {
	let app = apps[i];
	let appRecord = {};
	for (let dist of dists) {
		let [bundlerName, _] = dist.split("-");
		let totalSize = 0;
		const jsfiles = await glob(`packages/${app}/${dist}/**/*.js`, {
			ignore: "**/node_modules/**",
		});
		for (let f of jsfiles) {
			totalSize += fs.statSync(f).size;
		}
		appRecord[bundlerName] = totalSize;
	}
	recordMap[app] = appRecord;
}

const entries = toEntries(recordMap, "production build size");
persistEntries(entries, path.resolve(__dirname, "../metric.json"));
function toEntries(recordMap, metric) {
	let entries = [];
	Object.entries(recordMap).forEach(([app, records]) => {
		entries.push({
			case: app,
			metric,
			timestamp: Date.now(),
			commit: "",
			unit: "byte",
			records,
		});
	});
	return entries;
}

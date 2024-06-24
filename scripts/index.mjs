// export interface Entry {
// 	case: string;
// 	metric: string;
// 	timestamp: number;
// 	commit: string;
// 	unit: string;
// 	records: Record<string, number>;
// }

// load using import
import { glob, globSync, globStream, globStreamSync, Glob } from "glob";
import * as fs from "fs";
import * as path from "path";

const __dirname = import.meta.dirname;
const apps = fs.readdirSync(path.resolve(__dirname, "../packages"));

let recordMap = {};
const dists = ["parcel-dist", "esbuild-dist", "rolldown-dist", "webpack-dist"];

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

const entries = toEntrys(recordMap, "production build size");
persistEntries(entries, path.resolve(__dirname, "../metric.json"));
function toEntrys(recordMap, metric) {
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

function persistEntries(entries, filename) {
	for (let entry of entries) {
		fs.writeFileSync(filename, JSON.stringify(entry), { flag: "a" });
    fs.writeFileSync(filename, "\n", { flag: "a" });
	}
}

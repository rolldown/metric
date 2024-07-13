import { persistEntries } from "./utils.mjs";
import * as path from 'node:path'
import { fileURLToPath } from "node:url";
const __dirname = fileURLToPath(new URL(".", import.meta.url));

const compileTime = process.env.COMPILE_TIME;
const commit = process.env.COMMIT_HASH || "";
const repoUrl = process.env.GIT_REPOSITORY_URL || "";

const entry = {
	case: "rolldown self",
	metric: "release rompile time",
	timestamp: Date.now(),
	commit,
	unit: "s",
	records: {
		rolldown: compileTime,
	},
  repoUrl
};

persistEntries([entry], path.resolve(__dirname, "../metric.json"));

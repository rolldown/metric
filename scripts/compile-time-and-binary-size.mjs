import { persistEntries } from "./utils.mjs";
import * as path from 'node:path'
import { fileURLToPath } from "node:url";
const __dirname = fileURLToPath(new URL(".", import.meta.url));

const compileTime = process.env.COMPILE_TIME;
const commit = process.env.COMMIT_HASH || "";
const repoUrl = process.env.GIT_REPOSITORY_URL || "";
const binarySize = process.env.BINARY_SIZE || "";

const compileTimeEntry = {
	case: "rolldown self",
	metric: "release compile time",
	timestamp: Date.now(),
	commit,
	unit: "s",
	records: {
		rolldown: compileTime,
	},
  repoUrl: repoUrl ? `https://github.com/${repoUrl}` : ""
};

const binarySizeEntry = {
	case: "rolldown self",
	metric: "release binary size",
	timestamp: Date.now(),
	commit,
	unit: "byte",
	records: {
		rolldown: binarySize,
	},
  repoUrl: repoUrl ? `https://github.com/${repoUrl}` : ""
};

persistEntries([compileTimeEntry, binarySizeEntry], path.resolve(__dirname, "../metric.json"));

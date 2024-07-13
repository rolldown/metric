import { persistEntries } from "./utils.mjs";

const compileTime = process.env.COMPILE_TIME;

const entry = {
	case: "Rolldown",
  metric: "ReleaseRompileTime",
	timestamp: Date.now(),
	commit: "",
	unit: "s",
	records: {
    "rolldown": compileTime,
  },
};

persistEntries([entry]);

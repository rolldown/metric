import * as fs from "fs";
import { execSync } from "child_process";
export function persistEntries(entries, filename) {
  for (let entry of entries) {
    fs.writeFileSync(filename, JSON.stringify(entry), { flag: "a" });
    fs.writeFileSync(filename, "\n", { flag: "a" });
  }
}

export function getVersionMap() {
  const res = execSync(
    "pnpm list 'rolldown' 'vite' 'esbuild' '@rspack/cli' 'parcel' '@swc/core' --json",
    {},
  );

  const json = JSON.parse(res.toString());

  const deps = json[0].devDependencies;

  let versionMap = Object.entries(deps).reduce((pre, cur) => {
    let [name, info] = cur;
    if (name === "@rspack/cli") {
      name = "rspack"; // normalize rspack name
    } else if (name === "@swc/core") {
      name = "swc"; // normalize swc name
    }
    pre[name] = info.version;

    // set rolldown variants
    if (name === "rolldown") {
      pre["rolldown-strictExecutionOrder"] = info.version;
      pre["rolldown-onDemandWrapping"] = info.version;

      pre["rolldown-swc"] ??= "";
      pre["rolldown-swc"] = info.version + pre["rolldown-swc"];
    } else if (name === "swc") {
      pre["rolldown-swc"] ??= "";
      pre["rolldown-swc"] += ` (swc: ${info.version})`;
    }

    return pre;
  }, {});
  return versionMap;
}

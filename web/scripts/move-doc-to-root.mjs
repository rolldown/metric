import * as path from "path";
import * as fs from "fs";

fs.cpSync(
  path.resolve(import.meta.dirname, "../docs"),
  path.resolve(import.meta.dirname, "../../docs"),
  {
    recursive: true
  }
);

export function persistEntries(entries, filename) {
	for (let entry of entries) {
		fs.writeFileSync(filename, JSON.stringify(entry), { flag: "a" });
		fs.writeFileSync(filename, "\n", { flag: "a" });
	}
}

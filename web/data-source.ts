import { Entry } from "./types";
interface DataSource {
	fetchData(): Promise<Entry[]>;
}

class NetWorkDataSource implements DataSource {
	constructor(private url: string) {}

	async fetchData(): Promise<Entry[]> {
		const res = await fetch(this.url);
		const data = await res.text();
		const entries: Entry[] = data
			.split("\n")
			.filter(Boolean)
			.map((it) => JSON.parse(it));
		return entries;
	}
}

export async function initDataSource(): Promise<Entry[]> {
	// Both sources are Entry-schema JSON lines; the benchmark one carries
	// `metric`/`unit` per line ("production build time" in ms, "peak memory"
	// in byte), so no normalization happens here anymore.
	const res = await Promise.all([
		new NetWorkDataSource(
			"https://raw.githubusercontent.com/rolldown/metric/main/metric.json",
		).fetchData(),
		new NetWorkDataSource(
			"https://raw.githubusercontent.com/rolldown/benchmark-results-storage/main/benchmark-node-output.jsonl",
		).fetchData(),
	]);
	return res.flat();
}

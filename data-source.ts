import { Entry } from "./types";
type DataFetcher = () => Promise<string>;
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

class BasicDataSource implements DataSource {
	constructor(
		private fetch: DataFetcher,
		private normalized: (source: string) => Entry[],
	) {}

	async fetchData(): Promise<Entry[]> {
		const source = await this.fetch();
		return this.normalized(source);
	}
}
export async function initDataSource(): Promise<Entry[]> {
	const res = await Promise.all([
		new NetWorkDataSource(
			"https://raw.githubusercontent.com/rolldown/metric/main/metric.json",
		).fetchData(),
		new BasicDataSource(
			async () => {
				const res = await fetch("https://raw.githubusercontent.com/rolldown/benchmark-results-storage/main/benchmark-node-output.json");
				const data = await res.text();
				return data;
			},
			(source) => {
				const json = JSON.parse(source);
				let entries: Entry[] = [];
				json["entries"]?.["Node Benchmark"].forEach((item) => {
					let { commit, date, benches } = item;
					for (let i = 0, len = benches.length; i < len; i++) {
						entries.push({
							case: benches[i].name,
							metric: "production build time",
							unit: "ms",
							commit: commit.id,
							records: {
								rolldown: +benches[i].value,
							},
							timestamp: date,
						});
					}
				});
				return entries;
			},
		).fetchData(),
	]);
	return res.flat();
}

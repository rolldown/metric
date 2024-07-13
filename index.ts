import { groupBy } from "lodash-es";
import { Entry, Metric, Plots } from "./types";
import { initDataSource } from "./data-source";
import "./style.css";

function parseQueryString(): [Date?, Date?] {
	let start: Date | undefined = undefined;
	let end: Date | undefined = undefined;

	let query = new URLSearchParams(location.search);
	let startQuery = query.get("start");
	let endQuery = query.get("end");
	if (startQuery) {
		start = new Date(startQuery);
	}
	if (endQuery) {
		end = new Date(endQuery);
	}
	return [start, end];
}

function show_notification(html_text: string) {
	var notificationElem = document.getElementById("notification")!;
	notificationElem.innerHTML = html_text;
	notificationElem.classList.remove("hidden");
	setTimeout(() => {
		notificationElem.classList.add("hidden");
	}, 3000);
}

async function main() {
	let entries = await initDataSource();
	const [start, end] = parseQueryString();
	setTimeFrameInputs(start, end);
	const metrics = groupBy(
		entries.filter((entry) => {
			const lessThanEnd = end ? entry.timestamp <= +end : true;
			const biggerThanStart = start ? entry.timestamp >= +start : true;
			return lessThanEnd && biggerThanStart;
		}),
		(item: Entry) => {
			return `${item.case}/${item.metric}`;
		},
	);

	let [normalizedEntryDict, metricSet] = normalizeEntryDict(metrics);
	let metricContainerMap = initMetricContainer(metricSet);
	const plots = new Map<string, Plots>();

	for (let [
		series,
		{ unit, data, commit, timestamp, metric, repoUrl },
	] of Object.entries(normalizedEntryDict)) {
		let plotName = series;
		let seriesName: string;
		seriesName = series;
		let plot = plots.get(plotName);
		if (!plot) {
			plot = {
				data: [],
				layout: {
					title: plotName,
					xaxis: {
						type: "date",
						tickformat: "%Y-%m-%d",
					},
					yaxis: {
						title: unit,
						rangemode: "tozero",
					},
					width: Math.min(1200, window.innerWidth - 30),
					margin: {
						l: 50,
						r: 20,
						b: 100,
						t: 100,
						pad: 4,
					},
					legend: {
						orientation: window.innerWidth < 700 ? "h" : "v",
					},
				},
			};
			plots.set(plotName, plot);
		}

		Object.entries(data).forEach(([key, value]) => {
			console.log(`data: `, value, key);
			plot?.data.push({
				name: key,
				line: {
					// @ts-ignore
					shape: "hv",
				},
				x: timestamp.map((n) => new Date(n)),
				y: value,
				hovertext: commit,
				hovertemplate: `%{y} ${unit}<br>(%{hovertext})`,
				repoUrl: repoUrl,
			});
		});
	}
	const sortedPlots = Array.from(plots.entries());
	sortedPlots.sort(([t], [t2]) => t.localeCompare(t2));
	for (const [key, definition] of sortedPlots) {
		let [_, metric] = key.split("/");
		const plotDiv = document.createElement(
			"div",
		) as any as Plotly.PlotlyHTMLElement;

		definition.data.sort((a, b) => {
			if (a.name < b.name) {
				return -1;
			} else if (a.name > b.name) {
				return 1;
			} else {
				return 0;
			}
		});

		// @ts-ignore
		Plotly.newPlot(plotDiv, definition.data, definition.layout);
		plotDiv.on("plotly_click", (data) => {
			const commit_hash: string = (data.points[0] as any).hovertext;
			if (!commit_hash) {
				return;
			}
			let repoUrl =
				(data.points[data.points.length - 1 ] as any).repoUrl;
			const url = repoUrl ? `${repoUrl.trimEnd("/")}/commit/${commit_hash}` : commit_hash;
			console.log(`url: `, url);
			const notification_text = `Commit <b>${commit_hash}</b> URL copied to clipboard`;
			navigator.clipboard.writeText(url);
			show_notification(notification_text);
		});
		metricContainerMap.get(metric)?.appendChild(plotDiv);
	}
}

function initMetricContainer(metricSet: Set<string>) {
	let metricNames = Array.from(metricSet);
	// metric name: name => HTMLElement
	let metricContainerMap = new Map<string, HTMLElement>();
	metricNames.sort();
	for (let i = 0; i < metricNames.length; i++) {
		let metricName = metricNames[i];
		let metricContainer = document.createElement("details");
		metricContainer.id = `metric-${metricName}`;
    metricContainer.open = true;

		let divider = document.createElement("summary");
		divider.classList.add("divider");
		divider.innerText = metricName;
		metricContainer.appendChild(divider);

		metricContainerMap.set(metricName, metricContainer);
		document.getElementById("inner")!.appendChild(metricContainer);
	}
	return metricContainerMap;
}

function normalizeEntryDict(
	entries: Record<string, Entry[]>,
): [Record<string, Metric>, Set<string>] {
	let map = Object.create(null);
	let metricSet = new Set<string>();
	Object.entries(entries).map(([key, value]) => {
		value.sort((a, b) => {
			return +a.timestamp - +b.timestamp;
		});
		let data: Record<string, number[]> = {};
		let commit: string[] = [];
		let timestamp: number[] = [];

		for (let i = 0; i < value.length; i++) {
			let v = value[i];
			Object.entries(v.records).forEach(([key, value]) => {
				if (data[key] === undefined) {
					data[key] = [];
				}
				data[key].push(value);
			});
			commit.push(v.commit);
			timestamp.push(v.timestamp);
		}
		metricSet.add(value[0].metric);
		map[key] = {
			data,
			commit,
			timestamp,
			unit: value[0].unit,
			metric: value[0].metric,
			repoUrl: value[0].repoUrl,
		};
	});
	return [map, metricSet];
}

function setDays(n: number) {
	const timestamp = +new Date() - n * 1000 * 60 * 60 * 24;
	const date = new Date(timestamp);
	setTimeFrameInputs(date, undefined);
}

function getTimeFrameInputs(): [HTMLInputElement, HTMLInputElement] {
	const start = document.getElementsByName("start")[0] as HTMLInputElement;
	const end = document.getElementsByName("end")[0] as HTMLInputElement;
	return [start, end];
}

function setTimeFrameInputs(start?: Date, end?: Date) {
	const [startInput, endInput] = getTimeFrameInputs();
	(startInput as any).value = start ? start.toISOString().split("T")[0] : "";
	(endInput as any).value = end ? end.toISOString().split("T")[0] : "";
}

// @ts-ignore
window.setDays = setDays;
main();

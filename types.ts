export interface Entry {
	case: string;
	metric: string;
	timestamp: number;
	commit: string;
	unit: string;
	records: Record<string, number>;
}

export interface Metric {
	unit: string;
  metric: string,
	data: Record<string, number[]>;
	commit: string[];
	timestamp: number[];
}

export interface Plots {
	data: (Plotly.Data & { name: string })[];
	layout: Partial<Plotly.Layout>;
}

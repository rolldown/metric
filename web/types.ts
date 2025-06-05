export interface Entry {
	case: string;
	metric: string;
	timestamp: number;
	commit: string;
	unit: string;
	records: Record<string, number>;
  repoUrl?: String;
}

export interface Metric {
	unit: string;
  metric: string,
	data: Record<string, number[]>;
	commit: string[];
	timestamp: number[];
  repoUrl?: string;
}

export interface Plots {
	data: (Plotly.Data & { name: string })[];
	layout: Partial<Plotly.Layout>;
}

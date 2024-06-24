# Metric for rolldown


## Data Source format
We use this generic data struct for metric aggregation
```ts
export interface Entry {
	case: string; // case name
	metric: string; // which metric for the bench, like `production build time`, `production build size`
	timestamp: number; 
	commit: string; // commit hash
    repoUrl?: string; // what is the data source from, used for event tracking
	unit: string; // what is the data souce unit, like `ms`(in build speed bench), 'byte'(in build size bench)
	records: Record<string, number>; // key is the bundler name, value is the result of the corresponding bundler
}
```

## data source storage
Storing entries line by line, each line is a entry with a json format(Recommend).
1. Comparing with store the whole data in a json file, this method could reduce parsing, stringify overhead, especially the metric data source become bigger. 
2. Make streaming transform available, which may reduce white screen time.

This is not required, any format that could convert to `Entry[]` is acceptable.

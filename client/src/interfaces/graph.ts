export interface Graph {
    data?: GraphData;
    options?: GraphOptions;
}

export interface GraphData {
    labels?: string[];
    datasets?: GraphDataset[];
}

export interface GraphDataset {
    label?: string;
    data?: number[];
    backgroundColor?: string | string[];
    borderColor?: string | string[];
    borderWidth?: number;
}

export interface GraphOptions {
    plugins?: {
        legend?: {
            labels?: {
                color?: string,
            },
        },
    },
    scales?: {
        x?: {
            ticks?: {
                color?: string,
            },
            grid?: {
                color?: string,
            },
        },
        y?: {
            beginAtZero?: boolean,
            ticks?: {
                color?: string,
            },
            grid?: {
                color?: string,
            }
        },
    },
}
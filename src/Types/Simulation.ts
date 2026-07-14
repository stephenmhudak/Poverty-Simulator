export interface Bill {
    title: string;
    amounts: number[];
    dueBy: number;
}

export interface Hazard {
    title: string;
    description: string[];
    effects: HazardEffect[];
    timesUsed: number;
    maxTimesUsed: number;
    requires: string[];
}

interface HazardEffect {
    item: string;
    value: number[] | boolean[];
}

export interface Luck {
    title: string;
    description: string[];
    effects: LuckEffect[];
}

interface LuckEffect {
    item: string;
    value: number[];
}

export interface Intervention {
    title: string;
    description: string[];
    effects: InterventionEffect[];
}

interface InterventionEffect {
    item: string;
    options: number[] | boolean[];
}
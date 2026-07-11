export interface Bill {
    title: string;
    amounts: number[];
    reconnectFee?: number;
    dueBy: number;
}

export interface Hazard {
    title: string;
    description: string[];
    effects: HazardEffect[];
}

interface HazardEffect {
    item: string;
    options: number[] | boolean[];
}


export interface Luck {
    title: string;
    description: string[];
    effects: LuckEffect[];
}

interface LuckEffect {
    item: string;
    options: number[] | boolean[];
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
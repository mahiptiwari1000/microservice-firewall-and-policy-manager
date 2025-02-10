export interface Node extends d3.SimulationNodeDatum{
    id: string;
    group?: string;
    x?: number;
    y?: number;
    fx?: number | null;
    fy?: number | null;
}

export interface Link {
    source: Node | string;
    target: Node | string;
    status: "allow" | "deny";
}

export interface Policy {
    _id?: string; 
    source: string;
    target: string;
    action: "allow" | "deny";
}

export interface Log {
    id: number;
    timestamp: string;
    category: "Policy Update" | "Intrusion Attempt" | "User Login" | "Other";
    message: string;
}

export interface Policy {
    id?: string;
    source: string;
    target: string;
    action: "allow" | "deny";
}

export interface NetworkContextType {
    nodes: Node[];
    links: Link[];
    fetchData: () => void;
}
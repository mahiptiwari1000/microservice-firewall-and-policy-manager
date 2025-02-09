// Centralized Type Definitions

export interface Node {
    id: string;
    group?: string;
    x?: number;
    y?: number;
    fx?: number | null;
    fy?: number | null;
}

export interface Link {
    source: string;
    target: string;
    status: "allow" | "deny";
}

export interface Policy {
    id: number;
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

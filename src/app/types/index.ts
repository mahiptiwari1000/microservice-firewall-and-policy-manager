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
    _id?: string;  // 👈 Make _id optional to handle cases where it's not present
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

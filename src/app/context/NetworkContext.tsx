'use client';

import React, { createContext, useContext } from "react";
import { Node, Link } from "@/types";

// Define Context Type
interface NetworkContextType {
    nodes: Node[];
    links: Link[];
    addNode: (node: Node) => void;
    addLink: (link: Link) => void;
    removeNode: (nodeId: string) => void;
    removeLink: (linkIndex: number) => void;
    fetchData: () => Promise<void>;
}

// Create Context
const NetworkContext = createContext<NetworkContextType | undefined>(undefined);

// Provider Component
export const NetworkProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    // const [nodes, setNodes] = useState<Node[]>([]);
    // const [links, setLinks] = useState<Link[]>([]);

    // Sample Data
const nodes = [
    { id: "Web Server", group: "Service" },
    { id: "Database Server", group: "Database" },
    { id: "Application Server", group: "Service" },
    { id: "Firewall", group: "Security" }
];

const links = [
    { source: "Web Server", target: "Application Server", status: "allow" },
    { source: "Application Server", target: "Database Server", status: "allow" },
    { source: "Web Server", target: "Database Server", status: "deny" },
    { source: "Firewall", target: "Web Server", status: "allow" }
];

    // Function to fetch data from backend (Simulated)
    // const fetchData = async () => {
    //     try {
    //         const response = await fetch("/api/network"); // Replace with actual backend API
    //         const data = await response.json();
    //         setNodes(data.nodes);
    //         setLinks(data.links);
    //     } catch (error) {
    //         console.error("Failed to fetch network data", error);
    //     }
    // };

    // Function to add a new node
    // const addNode = (node: Node) => {
    //     setNodes((prevNodes) => [...prevNodes, node]);
    // };

    // Function to add a new link
    // const addLink = (link: Link) => {
    //     setLinks((prevLinks) => [...prevLinks, link]);
    // };

    // Function to remove a node and its associated links
    // const removeNode = (nodeId: string) => {
    //     setNodes((prevNodes) => prevNodes.filter((node) => node.id !== nodeId));
    //     setLinks((prevLinks) =>
    //         prevLinks.filter((link) => link.source.id !== nodeId && link.target.id !== nodeId)
    //     );
    // };

    // Function to remove a specific link
    // const removeLink = (linkIndex: number) => {
    //     setLinks((prevLinks) => prevLinks.filter((_, index) => index !== linkIndex));
    // };

    return (
        // <NetworkContext.Provider value={{ nodes, links, addNode, addLink, removeNode, removeLink, fetchData }}>
        <NetworkContext.Provider value={{ nodes, links}}>
            {children}
        </NetworkContext.Provider>
    );
};

// Hook to use Network Context
export const useNetwork = () => {
    const context = useContext(NetworkContext);
    if (!context) {
        throw new Error("useNetwork must be used within a NetworkProvider");
    }
    return context;
};
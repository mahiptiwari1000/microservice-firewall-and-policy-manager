'use client';

import React, { createContext, useContext, useEffect, useState } from "react";
import { Node, Link } from "@/types";
import {API_BASE_URL} from "@/config";
import { NetworkContextType } from "@/types";

const NetworkContext = createContext<NetworkContextType | undefined>(undefined);

export const NetworkProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
     const [nodes, setNodes] = useState<Node[]>([]);
     const [links, setLinks] = useState<Link[]>([]);


    const fetchData = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}api/network`);
            const data = await response.json();
            setNodes(data.nodes);
            setLinks(data.links);
        } catch (error) {
            console.error("Failed to fetch network data", error);
        }
    };

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

    useEffect(() => {
        fetchData();
    }, [])

    return (
        <NetworkContext.Provider value={{ nodes, links, fetchData}}>
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
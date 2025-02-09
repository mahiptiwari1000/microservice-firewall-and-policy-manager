"use client";

import { useState } from "react";
import Visualization from "./Visualization";
import { useNetwork } from "@/context/NetworkContext";

export default function Page() {
    const { nodes, links } = useNetwork();
    const [search, setSearch] = useState("");

    const filteredNodes = nodes.filter(node =>
        node.group.toLowerCase().includes(search.toLowerCase())
    );


    return (
        <div className="p-6 flex flex-col items-center">
            <h1 className="text-2xl font-semibold mb-4">Network Security Visualization</h1>

            <input 
                type="text"
                placeholder="Search Node..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="p-2 bg-gray-800 text-white rounded-md mb-4 w-80"
            />

            <div className="w-[1000px] h-[800px] bg-gray-900 p-4 rounded-lg shadow-md flex justify-center items-center">
                <Visualization nodes={filteredNodes} links={links} />
            </div>
        </div>
    );
}

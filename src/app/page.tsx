"use client";

import React from "react";
import Visualization from "./visualization/Visualization";
import { useNetwork } from "@/context/NetworkContext";
import { useEffect } from "react";

const Dashboard: React.FC = () => {
    const { nodes, links } = useNetwork();

    useEffect(() => {
        // fetchData(); // Uncomment this when backend integration is ready
    }, []);

    return (
        <div className="p-6">
            {/* Title */}
            <h1 className="text-2xl font-semibold mb-4">📊 Security Dashboard Overview</h1>

            {/* Grid Layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left Column: Policy Management */}
                <div className="bg-gray-800 p-4 rounded-lg shadow-md">
                    <h2 className="text-lg font-semibold mb-2">🔐 Manage Policies</h2>
                    <div className="flex gap-2 mb-4">
                        <select className="bg-gray-700 p-2 rounded text-white">
                            <option>Select Source</option>
                            <option>Web Server</option>
                            <option>Database Server</option>
                        </select>
                        <select className="bg-gray-700 p-2 rounded text-white">
                            <option>Select Target</option>
                            <option>Application Server</option>
                            <option>Firewall</option>
                        </select>
                        <select className="bg-gray-700 p-2 rounded text-white">
                            <option>Allow</option>
                            <option>Deny</option>
                        </select>
                        <button className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-500">
                            Add Policy
                        </button>
                    </div>

                    {/* Existing Policies Table */}
                    <h3 className="text-md font-semibold mb-2">📜 Existing Policies</h3>
                    <ul className="text-gray-300">
                        <li>Web Server → Application Server (Allow) ❌</li>
                        <li>Application Server → Database Server (Allow) ❌</li>
                        <li>Firewall → Web Server (Allow) ❌</li>
                    </ul>
                </div>

                {/* Right Column: Network Graph */}
                <div className="bg-gray-800 p-4 rounded-lg shadow-md flex flex-col items-center">
                    <h2 className="text-lg font-semibold mb-2">🛰️ Network Traffic Map</h2>
                    
                    {/* Visualization Wrapper */}
                    <div className="w-[600px] h-[400px] bg-black rounded-md flex items-center justify-center">
                        <Visualization nodes={nodes} links={links} />
                    </div>
                </div>
            </div>

            {/* Recent Logs Section */}
            <div className="bg-gray-800 p-4 rounded-lg shadow-md mt-6">
                <h2 className="text-lg font-semibold">📜 Recent Security Logs</h2>
                <ul className="text-gray-300 mt-2">
                    <li>[12:00 PM] Policy Updated: Web Server → Database Server (Deny)</li>
                    <li>[11:45 AM] New User Added: Security Admin</li>
                </ul>
            </div>
        </div>
    );
};

export default Dashboard;

"use client";
import { Log } from "@/types";

import React, { useState } from "react";
import { Download } from "lucide-react";


const initialLogs: Log[] = [
    { id: 2, timestamp: "2025-02-09 09:45 AM", category: "Intrusion Attempt", message: "Unauthorized access attempt detected from 192.168.1.12" },
    { id: 3, timestamp: "2025-02-09 08:30 AM", category: "User Login", message: "Admin user logged in successfully" },
    { id: 4, timestamp: "2025-02-09 07:00 AM", category: "Other", message: "System health check completed" }
];

const Logs: React.FC = () => {
    const [logs, setLogs] = useState<Log[]>(initialLogs);
    const [filter, setFilter] = useState<string>("All");

    const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setFilter(e.target.value);
    };

    const filteredLogs = filter === "All" ? logs : logs.filter(log => log.category === filter);

    const downloadLogs = () => {
        const csvContent = [
            ["ID", "Timestamp", "Category", "Message"],
            ...logs.map(log => [log.id, log.timestamp, log.category, log.message])
        ]
        .map(e => e.join(","))
        .join("\n");

        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.setAttribute("download", "security_logs.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-semibold mb-4">Security Logs</h1>

            <div className="flex gap-4 mb-4">
                <select value={filter} onChange={handleFilterChange}
                    className="bg-gray-700 p-2 rounded text-white">
                    <option value="All">Show All</option>
                    <option value="Policy Update">Policy Updates</option>
                    <option value="Intrusion Attempt">Intrusion Attempts</option>
                    <option value="User Login">User Logins</option>
                    <option value="Other">Other</option>
                </select>

                <button onClick={downloadLogs} className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-500 flex items-center gap-2">
                    <Download size={18} />
                    Download Logs
                </button>
            </div>

            <div className="bg-gray-800 p-4 rounded-lg shadow-md">
                <table className="w-full text-white">
                    <thead>
                        <tr className="bg-gray-700">
                            <th className="p-2">Timestamp</th>
                            <th className="p-2">Category</th>
                            <th className="p-2">Message</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredLogs.map(log => (
                            <tr key={log.id} className="border-b border-gray-600">
                                <td className="p-2">{log.timestamp}</td>
                                <td className={`p-2 ${log.category === "Intrusion Attempt" ? "text-red-500" : "text-white"}`}>
                                    {log.category}
                                </td>
                                <td className="p-2">{log.message}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Logs;

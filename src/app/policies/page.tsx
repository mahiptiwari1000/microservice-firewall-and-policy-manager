"use client";
import { Policy } from "@/types";


import React, { useState } from "react";

const AccessPolicies: React.FC = () => {
    const [policies, setPolicies] = useState<Policy[]>([
        { id: 1, source: "Web Server", target: "Database Server", action: "allow" },
        { id: 2, source: "Firewall", target: "Application Server", action: "deny" }
    ]);

    const [newPolicy, setNewPolicy] = useState<Policy>({ id: 0, source: "", target: "", action: "allow" });

    const handleInputChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setNewPolicy({ ...newPolicy, [e.target.name]: e.target.value });
    };

    const addPolicy = () => {
        if (!newPolicy.source || !newPolicy.target) return;
        setPolicies([...policies, { ...newPolicy, id: Date.now() }]);
        setNewPolicy({ id: 0, source: "", target: "", action: "allow" }); // Reset form
    };

    const deletePolicy = (id: number) => {
        setPolicies(policies.filter(policy => policy.id !== id));
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-semibold mb-4">Manage Access Policies</h1>

            <div className="bg-gray-800 p-4 rounded-lg shadow-md mb-6">
                <h2 className="text-lg font-semibold mb-3">Add New Policy</h2>
                <div className="flex gap-2">
                    <select name="source" value={newPolicy.source} onChange={handleInputChange}
                        className="bg-gray-700 p-2 rounded text-white">
                        <option value="">Select Source</option>
                        <option value="Web Server">Web Server</option>
                        <option value="Database Server">Database Server</option>
                        <option value="Firewall">Firewall</option>
                    </select>

                    <select name="target" value={newPolicy.target} onChange={handleInputChange}
                        className="bg-gray-700 p-2 rounded text-white">
                        <option value="">Select Target</option>
                        <option value="Application Server">Application Server</option>
                        <option value="Firewall">Firewall</option>
                        <option value="Database Server">Database Server</option>
                    </select>

                    <select name="action" value={newPolicy.action} onChange={handleInputChange}
                        className="bg-gray-700 p-2 rounded text-white">
                        <option value="allow">Allow</option>
                        <option value="deny">Deny</option>
                    </select>

                    <button onClick={addPolicy} className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-500">
                        Add Policy
                    </button>
                </div>
            </div>

            <div className="bg-gray-800 p-4 rounded-lg shadow-md">
                <h2 className="text-lg font-semibold mb-3">Existing Policies</h2>
                <table className="w-full text-white">
                    <thead>
                        <tr className="bg-gray-700">
                            <th className="p-2">Source</th>
                            <th className="p-2">Target</th>
                            <th className="p-2">Action</th>
                            <th className="p-2">Options</th>
                        </tr>
                    </thead>
                    <tbody>
                        {policies.map(policy => (
                            <tr key={policy.id} className="border-b border-gray-600">
                                <td className="p-2">{policy.source}</td>
                                <td className="p-2">{policy.target}</td>
                                <td className="p-2">
                                    <span className={`px-2 py-1 rounded-md 
                                        ${policy.action === "allow" ? "bg-green-500" : "bg-red-500"}`}>
                                        {policy.action === "allow" ? "Allow" : "Deny"}
                                    </span>
                                </td>
                                <td className="p-2">
                                    <button onClick={() => deletePolicy(policy.id)}
                                        className="bg-red-600 px-3 py-1 rounded hover:bg-red-500">
                                        Delete 
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AccessPolicies;

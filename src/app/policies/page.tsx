"use client";
import { Policy } from "@/types";
import { API_BASE_URL } from "@/config";
import React, { useEffect, useState } from "react";
import { useNetwork } from "@/context/NetworkContext";

const AccessPolicies: React.FC = () => {
    const [policies, setPolicies] = useState<Policy[]>([]);
    const { nodes, links, fetchData } = useNetwork();
    const [newPolicy, setNewPolicy] = useState<Policy>({ id: "", source: "", target: "", action: "allow" });

    
    const fetchPolicies = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}api/policies`);
            const data = await response.json();
            setPolicies(data.map((policy: Policy) => ({
                _id: policy._id,
                source: policy.source,
                target: policy.target,
                action: policy.action
            })));
        } catch (error) {
            console.error("Error fetching policies:", error);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setNewPolicy({ ...newPolicy, [e.target.name]: e.target.value });
    };

    const addPolicy = async () => {
        if (!newPolicy.source || !newPolicy.target) {
            return alert("Please enter both Source and Target nodes!");
        }

        try {
            await fetch(`${API_BASE_URL}api/policies`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newPolicy),
            });

            const sourceExists = nodes.some(node => node.id === newPolicy.source);
            const targetExists = nodes.some(node => node.id === newPolicy.target);

            const existingLink = links.find(
                link => link.source === newPolicy.source && link.target === newPolicy.target
            );

            if (existingLink && existingLink.status !== newPolicy.action) {
                await fetch(`${API_BASE_URL}api/network`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        nodes: [],
                        links: [{ source: newPolicy.source, target: newPolicy.target, status: newPolicy.action }]
                    }),
                });
            }

            if (!sourceExists || !targetExists || !existingLink) {
                await fetch(`${API_BASE_URL}api/network`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        nodes: [
                            ...(sourceExists ? [] : [{ id: newPolicy.source, group: "Unknown" }]),
                            ...(targetExists ? [] : [{ id: newPolicy.target, group: "Unknown" }])
                        ],
                        links: existingLink 
                            ? []
                            : [{ source: newPolicy.source, target: newPolicy.target, status: newPolicy.action }]
                    }),
                });
            }
    

            fetchData();
            fetchPolicies();

        } catch (error) {
            console.error("Error adding policy:", error);
        }

        setNewPolicy({ id: "", source: "", target: "", action: "allow" });
    };

    // const deletePolicy = async (id: string) => {
    //     try {
    //         const policyToDelete = policies.find(policy => policy._id === id);
    //         if (!policyToDelete) {
    //             console.error("Policy not found!");
    //             return;
    //         }
    
    //         const { source, target } = policyToDelete;
    
    //         await fetch(`${API_BASE_URL}api/policies/${id}`, {
    //             method: "DELETE",
    //         });
    
    //         await fetch(`${API_BASE_URL}api/network/link/${source}/${target}`, {
    //             method: "DELETE",
    //         });
    
    //         const remainingLinks = links.filter(
    //             link => link.source === source || link.target === source || link.source === target || link.target === target
    //         );
    
    //         if (!remainingLinks.some(link => link.source === source || link.target === source)) {
    //             await fetch(`${API_BASE_URL}api/network/node/${source}`, {
    //                 method: "DELETE",
    //             });
    //         }
    
    //         if (!remainingLinks.some(link => link.source === target || link.target === target)) {
    //             await fetch(`${API_BASE_URL}api/network/node/${target}`, {
    //                 method: "DELETE",
    //             });
    //         }
    
    //         setPolicies(policies.filter(policy => policy._id !== id));
    
    //         fetchData();
    //         fetchPolicies();
    //     } catch (error) {
    //         console.error("Error deleting policy:", error);
    //     }
    // };
    

    useEffect(() => {
        fetchPolicies();
    }, []);

    return (
        <div className="p-6">
            <h1 className="text-2xl font-semibold mb-4">Manage Access Policies</h1>

            <div className="bg-gray-800 p-4 rounded-lg shadow-md mb-6">
                <h2 className="text-lg font-semibold mb-3">Add New Policy</h2>
                <div className="flex gap-2">
                    <input
                        type="text"
                        name="source"
                        placeholder="Enter Source Node"
                        value={newPolicy.source}
                        onChange={handleInputChange}
                        className="bg-gray-700 p-2 rounded text-white"
                    />

                    <input
                        type="text"
                        name="target"
                        placeholder="Enter Target Node"
                        value={newPolicy.target}
                        onChange={handleInputChange}
                        className="bg-gray-700 p-2 rounded text-white"
                    />

                    <select
                        name="action"
                        value={newPolicy.action}
                        onChange={handleInputChange}
                        className="bg-gray-700 p-2 rounded text-white"
                    >
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

                <table className="w-full text-white border-collapse">
                    <thead>
                        <tr className="bg-gray-700 text-left">
                            <th className="p-3">Source</th>
                            <th className="p-3">Target</th>
                            <th className="p-3">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {policies.map((policy, index) => (
                            <tr key={index} className="border-b border-gray-600">
                                <td className="p-3">{policy.source}</td>
                                <td className="p-3">{policy.target}</td>
                                <td className="p-3">
                                    <span className={`px-2 py-1 rounded-md text-sm font-medium 
                                        ${policy.action === "allow" ? "bg-green-500" : "bg-red-500"}`}>
                                        {policy.action === "allow" ? "Allow" : "Deny"}
                                    </span>
                                </td>
                                {/* <td className="p-3">
                                <button onClick={() => deletePolicy(policy._id)}
                                        className="bg-red-600 px-3 py-1 rounded hover:bg-red-500">
                                        Delete 
                                    </button>
                                </td> */}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AccessPolicies;

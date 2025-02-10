"use client";

import React, { useEffect, useState } from "react";
import Visualization from "./visualization/Visualization";
import { useNetwork } from "@/context/NetworkContext";
import { API_BASE_URL } from "@/config";
import { Policy } from "./types";

const Dashboard: React.FC = () => {
    const { nodes, links, fetchData } = useNetwork();
    const [policies,setPolicies] = useState<Policy[]>([]);
    const [source, setSource] = useState("");
    const [target, setTarget] = useState("");
    const [action, setAction] = useState("allow");

    const fetchPolicies = async () => {
      try {
          const response = await fetch(`${API_BASE_URL}api/policies`);
          const data = await response.json();
          setPolicies(data);
      } catch (error) {
          console.error("Error fetching policies:", error);
      }
  };

    useEffect(() => {
      fetchPolicies();
      fetchData();
  }, []);


    const addPolicy = async () => {
      if (!source || !target) return alert("Please select source and target nodes!");

      try {
          await fetch(`${API_BASE_URL}api/policies`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ source, target, action }),
          });

          const sourceExists = nodes.some(node => node.id === source);
          const targetExists = nodes.some(node => node.id === target);
          const existingLink = links.some(link => link.source === source && link.target === target);

          if (!sourceExists || !targetExists || !existingLink || (existingLink && existingLink.status !== action)) {
            await fetch(`${API_BASE_URL}api/network`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    nodes: [
                        ...(sourceExists ? [] : [{ id: source, group: "Unknown" }]),
                        ...(targetExists ? [] : [{ id: target, group: "Unknown" }])
                    ],
                    links: existingLink && existingLink.status !== action 
                        ? [{ source, target, status: action }] // ✅ If action changed, update status
                        : existingLink 
                            ? [] // ✅ Don't add the same link again
                            : [{ source, target, status: action }] // ✅ If link doesn't exist, add it
                }),
            });
        
            console.log("✅ Network updated!");
        }        

          fetchData();
          fetchPolicies();

      } catch (error) {
          console.error("Error:", error);
      }

      setSource(""); setTarget(""); setAction("allow"); 
  };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-semibold mb-4">Security Dashboard Overview</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-800 p-4 rounded-lg shadow-md">
                    <h2 className="text-lg font-semibold mb-2">Manage Policies</h2>
                    <div className="flex gap-2 mb-4">
                    <input
                    type="text"
                    placeholder="Enter Source Node"
                    value={source}
                    onChange={(e) => setSource(e.target.value)}
                    className="bg-gray-700 p-2 rounded text-white"
                />

                <input
                    type="text"
                    placeholder="Enter Target Node"
                    value={target}
                    onChange={(e) => setTarget(e.target.value)}
                    className="bg-gray-700 p-2 rounded text-white"
                />

                <select
                    className="bg-gray-700 p-2 rounded text-white"
                    value={action}
                    onChange={(e) => setAction(e.target.value)}
                >
                    <option value="allow">Allow</option>
                    <option value="deny">Deny</option>
                </select>
                        <button onClick={addPolicy} className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-500">
                            Add Policy
                        </button>
                    </div>

                    <h3 className="text-md font-semibold mb-2">Existing Policies</h3>
                    <table className="w-full text-white border-collapse">
        <thead>
            <tr className="bg-gray-700 text-left">
                <th className="p-3">Source</th>
                <th className="p-3">Target</th>
                <th className="p-3">Action</th>
            </tr>
        </thead>
        <tbody>
            {policies.length === 0 ? (
                <tr>
                    <td className="p-3 text-center text-gray-500" colSpan={3}>No policies available</td>
                </tr>
            ) : (
                policies.map((policy, index) => (
                    <tr key={index} className="border-b border-gray-600">
                        <td className="p-3">{policy.source}</td>
                        <td className="p-3">{policy.target}</td>
                        <td className="p-3">
                            <span className={`px-2 py-1 rounded-md text-sm font-medium 
                                ${policy.action === "allow" ? "bg-green-500" : "bg-red-500"}`}>
                                {policy.action === "allow" ? "Allow" : "Deny"}
                            </span>
                        </td>
                    </tr>
                ))
            )}
        </tbody>
    </table>
                </div>

                <div className="bg-gray-800 p-4 rounded-lg shadow-md flex flex-col items-center">
                    <h2 className="text-lg font-semibold mb-2">Network Traffic Map</h2>
                    
                    <div className="w-[600px] h-[400px] bg-black rounded-md flex items-center justify-center">
                        <Visualization nodes={nodes} links={links}/>
                    </div>
                </div>
            </div>

            {/* Recent Logs Section */}
            <div className="bg-gray-800 p-4 rounded-lg shadow-md mt-6">
                <h2 className="text-lg font-semibold">Recent Security Logs</h2>
                <ul className="text-gray-300 mt-2">
                    <li>[11:45 AM] New User Added: Security Admin</li>
                </ul>
            </div>
        </div>
    );
};

export default Dashboard;

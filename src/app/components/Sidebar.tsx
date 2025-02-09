"use client";

import React, { useState } from "react";
import { LayoutGrid, Network, ShieldCheck, FileText, Menu } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Sidebar: React.FC = () => {
    const [isOpen, setIsOpen] = useState(true);
    const pathname = usePathname();

    // Sidebar links
    const links = [
        { name: "Dashboard", href: "/", icon: <LayoutGrid size={22} /> },
        { name: "Network Traffic Map", href: "/visualization", icon: <Network size={22} /> },
        { name: "Access Policies", href: "/policies", icon: <ShieldCheck size={22} /> },
        { name: "Security Logs", href: "/logs", icon: <FileText size={22} /> },
    ];

    return (
        <div className={`bg-gray-900 text-white h-screen transition-all duration-100 ${isOpen ? "w-64" : "w-20"}`}>
            {/* Sidebar Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-700">
                <span className="text-lg font-semibold">
                    {isOpen ? "NetShield" : "🛡️"}
                </span>
                <Menu 
                    className="cursor-pointer text-gray-400 hover:text-white" 
                    size={24} 
                    onClick={() => setIsOpen(!isOpen)} 
                />
            </div>

            {/* Sidebar Navigation */}
            <nav className="mt-4">
                <ul className="space-y-2">
                    {links.map((link) => (
                        <li key={link.href}>
                            <Link
                                href={link.href}
                                className={`flex items-center gap-3 px-5 py-3 rounded-md transition-all duration-300 
                                    ${pathname === link.href ? "bg-gray-700 text-white" : "hover:bg-gray-800"}
                                `}
                            >
                                {link.icon} {isOpen && <span>{link.name}</span>}
                            </Link>
                        </li>
                    ))}
                </ul>
            </nav>
        </div>
    );
};

export default Sidebar;
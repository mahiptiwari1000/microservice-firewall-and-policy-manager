import "./globals.css";
import React from "react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import { NetworkProvider } from "@/context/NetworkContext";


export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <body className="bg-gray-950 text-white">
                <div className="flex h-screen">
                    {/* Sidebar - Fixed width */}
                    <Sidebar />

                    {/* Main Content Area */}
                    <div className="flex flex-col flex-1">
                        {/* Header - Stays on top */}
                        <Header />

                        {/* Main Content */}
                        <main className="flex-1 p-6 overflow-auto">
                        <NetworkProvider>
                            {children}
                          </NetworkProvider>
                        </main>
                    </div>
                </div>
            </body>
        </html>
    );
}

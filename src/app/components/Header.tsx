import React from "react";
import { Bell, Search, UserCircle, SatelliteDish } from "lucide-react";

const Header: React.FC = () => {
    return (
        <header className="bg-gray-900 text-white flex items-center justify-between px-6 py-3 shadow-md">
            {/* Left: Logo / Title */}
            <div className="flex items-center gap-2 text-xl font-semibold">
                <SatelliteDish size={24} className="text-blue-400" /> 
                Network Security Dashboard
            </div>

            {/* Middle: Search Bar */}
            <div className="relative w-1/3 hidden md:block">
                <input
                    type="text"
                    placeholder="Search..."
                    className="w-full bg-gray-800 text-white py-2 px-4 rounded-lg focus:outline-none"
                />
                <Search className="absolute right-3 top-3 text-gray-400" size={18} />
            </div>

            {/* Right: Notifications & User Profile */}
            <div className="flex items-center gap-4">
                {/* Notification Icon */}
                <Bell className="text-gray-400 hover:text-white cursor-pointer" size={22} />

                {/* Profile Dropdown */}
                <div className="relative">
                    <UserCircle className="text-gray-400 hover:text-white cursor-pointer" size={28} />
                    {/* Dropdown */}
                    <div className="absolute right-0 mt-2 w-40 bg-gray-800 shadow-lg rounded-md hidden group-hover:block">
                        <ul className="py-2 text-gray-300">
                            <li className="px-4 py-2 hover:bg-gray-700 cursor-pointer">Profile</li>
                            <li className="px-4 py-2 hover:bg-gray-700 cursor-pointer">Settings</li>
                            <li className="px-4 py-2 hover:bg-red-600 cursor-pointer">Logout</li>
                        </ul>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;

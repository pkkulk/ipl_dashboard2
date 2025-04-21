"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import playersMockData from "@/data/playersMockData";
// Mock Data (Replace with API data in a real app)

const Players = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredPlayers = playersMockData.filter((player) =>
    player.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col">
      <div className="pt-16 bg-gradient-to-b from-gray-100 to-white">
        <div className="section-container py-8">
          <h1 className="text-3xl font-bold text-center mb-4">IPL Players</h1>
          <p className="text-center text-gray-600 max-w-3xl mx-auto mb-8">
            Discover the top players in the Indian Premier League.
          </p>
        </div>
      </div>

      <main className="flex-grow section-container">
        {/* Search Bar */}
        <div className="m-5 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <Input
            type="text"
            placeholder="Search players..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Players Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in m-5">
          {filteredPlayers.map((player) => (
            <Link key={player.id} href={`/players/${player.id}`} passHref>
              <div
                className="rounded-3xl shadow-lg overflow-hidden group transition-transform transform hover:scale-105 hover:shadow-xl cursor-pointer"
                style={{
                  backgroundColor: player.color,
                  border: `4px solid ${player.color}`,
                  color: "white",
                }}
              >
                {/* Player Image */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={player.image}
                    alt={player.name}
                    width={150}
                    height={150}
                    className="w-1/2 h-full mx-auto p-2 mt-2object-cover group-hover:scale-110 transition-transform"
                  /> 
                </div>

                {/* Player Info */}
                <div className="p-5 text-center">
                  <h3 className="text-lg font-semibold mb-2">{player.name}</h3>
                  <p className="text-sm">{player.role} - {player.team}</p>
                  <div className="grid grid-cols-2 gap-4 mt-3">
                    <div>
                      <p className="text-sm">Runs</p>
                      <p className="text-xl font-bold">{player.runs}</p>
                    </div>
                    <div>
                      <p className="text-sm">Wickets</p>
                      <p className="text-xl font-bold">{player.wickets}</p>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
          {filteredPlayers.length === 0 && (
            <div className="col-span-full text-center py-12">
              <p className="text-xl text-gray-500">
                No players found matching &quot;{searchTerm}&quot;
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Players;

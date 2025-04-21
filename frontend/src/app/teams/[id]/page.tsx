"use client";
import { useParams } from "next/navigation";
import teamsMockData from "@/data/teamsMockData";
import Image from "next/image";
import { useEffect, useState } from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar
} from "recharts";

const TeamPage = () => {
  const { id } = useParams();
  const team = teamsMockData.find((team) => team.id === Number(id));
  const [performance, setPerformance] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [stageStats, setStageStats] = useState<any>({});

  useEffect(() => {
    if (!team) return;

    const fetchStats = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/team-stats/${team.name}`);
        const data = await res.json();
        setPerformance(data);
      } catch (error) {
        console.error("Failed to fetch performance:", error);
      } finally {
        setLoading(false);
      }
    };
    const fetchStageStats = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/team-stage-stats/${team.name}`);
        const data = await res.json();
        setStageStats(data);
      } catch (error) {
        console.error("Failed to fetch stage stats:", error);
      }
    };
    

    fetchStats();
    fetchStageStats();
  }, [team]);

  if (!team) {
    return <div className="text-center text-3xl font-bold mt-10 text-red-500">Team not found</div>;
  }

  // Transform data for chart
  const chartData = Object.entries(performance).map(([year, rounds]: any) => {
    let totalMatches = 0;
    let totalWins = 0;

    for (const round of Object.values(rounds)) {
      totalMatches += round.matches;
      totalWins += round.wins;
    }

    return {
      year,
      matches: totalMatches,
      wins: totalWins,
      winRate: totalMatches > 0 ? ((totalWins / totalMatches) * 100).toFixed(2) : 0,
    };
  });
  const stageChartData = Object.entries(stageStats).map(([year, stages]: any) => {
    const entry: { year: any; [key: string]: any } = { year };
    for (const stage in stages) {
      entry[stage] = stages[stage].matches;
    }
    return entry;
  });
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-10 px-5">
      {/* Header */}
      <div
        className="relative w-full flex flex-col items-center justify-center py-24 md:py-32 shadow-lg"
        style={{
          background: `linear-gradient(to right, ${team.primaryColor}, ${team.secondaryColor})`,
          borderRadius: "0 0 50px 50px",
        }}
      >
        <div className="absolute -bottom-12 bg-white p-4 rounded-full shadow-lg">
          <Image
            src={team.logo || "/MI.png"}
            alt={`${team.name} Logo`}
            width={100}
            height={150}
            className="object-contain drop-shadow-lg"
            unoptimized
          />
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold text-white drop-shadow-md">{team.name}</h1>
      </div>

      {/* Info */}
      <div className="bg-white p-6 md:p-10 shadow-lg rounded-3xl max-w-4xl w-full text-center mt-16">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">{team.name}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          <div className="bg-gray-100 p-6 rounded-xl">
            <p className="text-xl font-semibold text-gray-700">🏆 Titles</p>
            <p className="text-3xl font-bold">{team.titles}</p>
          </div>
          <div className="bg-gray-100 p-6 rounded-xl">
            <p className="text-xl font-semibold text-gray-700">📊 Matches</p>
            <p className="text-3xl font-bold">{team.matches}</p>
          </div>
          <div className="bg-gray-100 p-6 rounded-xl">
            <p className="text-xl font-semibold text-gray-700">⚡ Win %</p>
            <p className="text-3xl font-bold">{((team.titles / team.matches) * 100).toFixed(2)}%</p>
          </div>
        </div>

        <div className="mt-8">
          <h3 className="text-2xl font-semibold text-gray-800 mb-4">📈 Performance Summary</h3>
          <p className="text-gray-600 text-lg">
            {team.name} has won <strong>{team.titles}</strong> titles in <strong>{team.matches}</strong> matches.
          </p>
        </div>
      </div>

      {/* Chart */}
      <div className="mt-12 w-full max-w-6xl p-6 bg-white shadow-lg rounded-2xl">
        <h2 className="text-2xl font-bold mb-6 text-center">📊 Yearly Performance</h2>
        {loading ? (
          <p className="text-center text-gray-500">Loading chart...</p>
        ) : (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="matches" fill="#8884d8" name="Matches" />
              <Bar dataKey="wins" fill="#82ca9d" name="Wins" />
            </BarChart>
          </ResponsiveContainer>
          
        )}
        {/* Stage Chart */}
        <div className="mt-16 w-full max-w-6xl p-6 bg-white shadow-lg rounded-2xl">
  <h2 className="text-2xl font-bold mb-6 text-center">🏟️ Matches by Stage & Year</h2>
  {loading ? (
    <p className="text-center text-gray-500">Loading chart...</p>
  ) : (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={stageChartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="year" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="League" stackId="a" fill="#8884d8" />
        <Bar dataKey="Qualifier" stackId="a" fill="#82ca9d" />
        <Bar dataKey="Eliminator" stackId="a" fill="#ffc658" />
        <Bar dataKey="Final" stackId="a" fill="#ff8042" />
      </BarChart>
    </ResponsiveContainer>
  )}
</div>

      </div>
    </div>
  );
};

export default TeamPage;

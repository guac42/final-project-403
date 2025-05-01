'use client';

import {useState} from "react";
import {formatRuntime, Title} from "@/app/lib/types";
import Link from "next/link";

type Episode = {
    season: number;
    episode: number;
} & Title;

export default function EpisodeDisplay({episodes}: { episodes: Episode[] }) {
    const seasons = Array.from(new Set(episodes.map((ep) => ep.season))).sort((a, b) => a - b);
    const [activeSeason, setActiveSeason] = useState(seasons[0]);

    const filteredEpisodes = episodes
        .filter((ep) => ep.season === activeSeason)
        .sort((a, b) => a.episode - b.episode);

    return (
        <>
            {/* Tabs */}
                <div className="flex space-x-2 mb-4 border-b">
                    {seasons.map((season) => (
                        <button
                            key={season}
                            onClick={() => setActiveSeason(season)}
                            className={`px-4 py-2 border-b-2 font-medium ${
                                activeSeason === season
                                    ? 'border-blue-600 text-blue-600'
                                    : 'border-transparent text-gray-600 hover:text-blue-500'
                            }`}
                        >
                            Season {season}
                        </button>
                    ))}
                </div>

            {/* Episodes */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    {filteredEpisodes.map((ep) => (
                        <Link key={ep.titleid} href={`/title/${ep.titleid}`}
                              className="bg-card p-4 shadow-md rounded transition transform hover:scale-105 hover:shadow-lg">
                            <h2 className="text-lg font-semibold text-card-foreground">{ep.primarytitle}</h2>
                            <h3 className="text-sm text-muted-foreground mb-2">S{ep.season}.E{ep.episode}{ep.runtimeminutes && (`| ${formatRuntime(ep.runtimeminutes)}`)}</h3>
                            <p className="text-yellow-500 text-sm font-medium">⭐ {ep.averagerating} / 10</p>
                        </Link>
                    ))}
                </div>
        </>
    );
}
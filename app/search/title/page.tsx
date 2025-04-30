'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Title, TitleType, typeToString } from "@/app/lib/types";
import { Badge } from "@/components/ui/badge";

export default function TitleSearchPage() {
    const searchParams = useSearchParams();
    const query = searchParams.get('q') || '';
    const [titles, setTitles] = useState<(Title&{ similarity: number })[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!query) return;
        const fetchMovies = async () => {
            setLoading(true);
            const res = await fetch(`/api/search/title?q=${encodeURIComponent(query)}`);
            const data = await res.json();
            setTitles(data);
            setLoading(false);
        };
        fetchMovies();
    }, [query]);

    if (!query) {
        return <p className="text-center text-gray-600">Enter a search query above to find results.</p>;
    }

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6">Results for &#34;{query}&#34;</h1>

            {loading && <p>Loading...</p>}
            {!loading && titles.length === 0 && <p>No results found.</p>}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {titles.map((title) => {
                    const info: string[] = [];
                    if (title.titletype != TitleType.Movie) {
                        info.push(typeToString(title.titletype));
                    }
                    if (title.startyear && title.endyear) {
                        info.push(`${title.startyear}–${title.endyear}`);
                    } else if (title.startyear) {
                        info.push(title.startyear.toString());
                    }
                    return (
                        <Link key={title.titleid} href={`/title/${title.titleid}`} className="bg-card p-4 shadow-md rounded transition transform hover:scale-105 hover:shadow-lg">
                            <h2 className="text-xl font-semibold text-card-foreground">{title.primarytitle}</h2>
                            <h3 className="text-md text-muted-foreground mb-2">{info.join(" | ")}</h3>
                            <div className="flex items-center gap-2">
                                {title.isadult && (<Badge key="destructive" variant="destructive" className="rounded-full">Adult</Badge>)}
                                {title.genres?.filter((genre) => !title.isadult || genre !== "Adult").map((genre) => (
                                    <Badge key={genre} variant="outline" className="rounded-full">{genre}</Badge>
                                ))}
                            </div>
                        </Link>
                    )
                })}
            </div>
        </div>
    );
}
'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Person } from "@/app/lib/types";

export default function TitleSearchPage() {
    const searchParams = useSearchParams();
    const query = searchParams.get('q') || '';
    const [people, setPeople] = useState<(Person&{ similarity: number })[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!query) return;
        const fetchMovies = async () => {
            setLoading(true);
            setPeople([]);
            const res = await fetch(`/api/search/person?q=${encodeURIComponent(query)}`);
            const data = await res.json();
            setPeople(data);
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
            {!loading && people.length === 0 && <p>No results found.</p>}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {people.map((person) => {
                    return (
                        <Link key={person.personid} href={`/person/${person.personid}`} className="bg-card p-4 shadow-md rounded transition transform hover:scale-105 hover:shadow-lg">
                            <h2 className="text-xl font-semibold text-card-foreground">{person.primaryname}</h2>
                            <h3 className="text-md text-muted-foreground mb-2 capitalize">{person.primaryprofession?.split(",").map((profession) => profession.split("_").join(" ")).join(" | ")}</h3>
                            {/*<div className="flex items-center gap-2">
                                {person.isadult && (<Badge key="destructive" variant="destructive" className="rounded-full">Adult</Badge>)}
                                {person.genres?.filter((genre) => !person.isadult || genre !== "Adult").map((genre) => (
                                    <Badge key={genre} variant="outline" className="rounded-full">{genre}</Badge>
                                ))}
                            </div>*/}
                        </Link>
                    )
                })}
            </div>
        </div>
    );
}
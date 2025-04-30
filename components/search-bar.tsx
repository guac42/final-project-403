'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';

export default function SearchBar() {
    const router = useRouter();
    const [query, setQuery] = useState('');
    const [searchType, setSearchType] = useState<'title' | 'person'>('title');

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (query.trim()) {
            router.push(`/search/${searchType}?q=${encodeURIComponent(query.trim())}`);
            setQuery('');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex w-full max-w-2xl">
            <select
                value={searchType}
                onChange={(e) => setSearchType(e.target.value as 'title' | 'person')}
                className="p-2 bg-muted border-l border-b border-t border-gray-300 rounded-l-md"
            >
                <option value="title" className="text-muted-foreground">Titles</option>
                <option value="person" className="text-muted-foreground">People</option>
            </select>
            <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={`Search ${searchType === 'title' ? "titles" : "people"}...`}
                className="flex-1 p-2 border border-gray-300"
                required
            />
            <button type="submit" className="bg-blue-600 text-white px-4 rounded-r-md">
                Search
            </button>
        </form>
    );
}
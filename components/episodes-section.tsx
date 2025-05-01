import { Suspense } from "react";
import { query } from "@/lib/db";
import { Title } from "@/app/lib/types";
import EpisodeDisplay from "@/components/episode-display";

type Episode = {
    season: number;
    episode: number;
} & Title;

export default function EpisodesSection({ titleId }: { titleId: number }) {
    return (
        <>
            <h2 className="text-2xl font-bold mb-2">Episodes</h2>
            <Suspense fallback={<p>Loading episodes...</p>}>
                <Episodes titleId={titleId}/>
            </Suspense>
        </>
    );
}

async function Episodes({ titleId }: { titleId: number }) {
    const episodes_query = await query(
        `
        SELECT titles.*, seasonNumber AS season, episodeNumber AS episode
        FROM episodes
            JOIN titles USING (titleId)
        WHERE parentId = $1
        `,
        [titleId],
    );

    const episodes: Episode[] = episodes_query.rows;

    if (episodes.length == 0) {
        return (
            <p className="mb-4">No episodes found :/</p>
        );
    }

    return (
        <EpisodeDisplay episodes={episodes} />
    );
}
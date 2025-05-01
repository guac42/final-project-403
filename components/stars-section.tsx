import { query } from "@/lib/db";
import Link from "next/link";
import { Suspense } from "react";

type Star = {
    personid: number;
    primaryname: string;
    characters: string[];
};

export default async function StarsSection({ titleId }: { titleId: number }) {
    return (
        <>
            <h2 className="text-2xl font-bold mb-2">Stars</h2>
            <Suspense fallback={<p>Loading stars...</p>}>
                <Stars titleId={titleId}/>
            </Suspense>
        </>
    );
}

async function Stars({ titleId }: { titleId: number }) {
    const stars_query = await query(
        `
        WITH known_for_sum AS (
            SELECT personId, sum(numVotes) AS sum
            FROM known_for
                JOIN titles USING (titleId)
            GROUP BY personId
        )
        SELECT personId, primaryName, characters, (SELECT sum FROM known_for_sum AS kfs WHERE kfs.personId = principals.personId) AS sum
        FROM principals
            JOIN people USING (personId)
        WHERE titleId = $1
            AND "category" BETWEEN 'self'::principal_category AND 'actress'::principal_category
        ORDER BY sum DESC
        LIMIT 20
        `,
        [titleId]
    );

    const stars: Star[] = stars_query.rows;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {stars.map((star) => (
                <div key={star.personid} className="bg-card p-4 shadow-md rounded">
                    <Link href={`/person/${star.personid}`} className="hover:underline">
                        {star.primaryname}
                    </Link>
                    <h3 className="text-md text-muted-foreground">{star.characters.join(", ")}</h3>
                </div>
            ))}
        </div>
    );
}
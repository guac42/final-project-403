import Link from "next/link";
import {query} from "@/lib/db";

export default async function CrewSection({ titleId }: { titleId: number }) {
    const crew_query = await query(
        `
        SELECT personId, primaryName, role
        FROM crew
            JOIN people USING (personId)
        WHERE titleId = $1
        `,
        [titleId]
    );

    const crew: { personid: number; primaryname: string, role: string }[] = crew_query.rows;

    return (
        <>
            <h2 className="text-2xl font-bold mb-2">Directors</h2>
            <div className="flex flex-wrap items-center gap-x-2 mb-4">
                {crew
                    .filter((director) => director.role === "director")
                    .map((director) => (
                        <Link key={director.personid} href={`/person/${director.personid}`} className="hover:underline">
                            {director.primaryname}
                        </Link>
                    ))}
            </div>

            <h2 className="text-2xl font-bold mb-2">Writers</h2>
            <div className="flex flex-wrap items-center gap-x-2 mb-4">
                {crew
                    .filter((writer) => writer.role === "writer")
                    .map((writer) => (
                        <Link key={writer.personid} href={`/person/${writer.personid}`} className="hover:underline">
                            {writer.primaryname}
                        </Link>
                    ))}
            </div>
        </>
    )
}
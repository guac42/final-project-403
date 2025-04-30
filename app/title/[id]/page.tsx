import { query } from '@/lib/db';
import { notFound } from 'next/navigation';
import { formatRuntime, Title, TitleType, typeToString } from "@/app/lib/types";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

interface Props {
    params: {
        id: string;
    };
}

export default async function TitlePage({ params }: Props) {
    const titleId = parseInt((await params).id, 10);

    if (isNaN(titleId)) {
        notFound();
    }

    const res = await query(
        `
    SELECT *
    FROM titles
    WHERE titleId = $1
    `,
        [titleId]
    );

    const title: Title | undefined = res.rows[0];

    if (!title) {
        notFound();
    }

    const stars_query = await query(
        `
        WITH known_for_sum AS (
            SELECT personId, sum(numVotes) AS sum
            FROM known_for
                JOIN titles USING (titleId)
            GROUP BY personId
        )
        SELECT personId, primaryName, (SELECT sum FROM known_for_sum AS kfs WHERE kfs.personId = known_for.personId) AS sum
        FROM known_for
            JOIN people USING (personId)
        WHERE titleId = $1
        ORDER BY sum DESC
        LIMIT 20
        `,
        [titleId]
    );

    const stars: { personid: number; primaryname: string }[] = stars_query.rows;

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

    const info: string[] = [];

    if (title.titletype != TitleType.Movie) {
        info.push(typeToString(title.titletype));
    }

    if (title.startyear && title.endyear) {
        info.push(`${title.startyear}–${title.endyear}`);
    } else if (title.startyear) {
        info.push(title.startyear.toString());
    }

    if (title.runtimeminutes) {
        info.push(formatRuntime(title.runtimeminutes))
    }

    return (
        <div className="max-w-2xl mx-auto p-6">
            <h1 className="text-4xl font-bold mb-4">{title.primarytitle}</h1>
            <p className="text-accent-foreground mb-2">{info.join(" | ")}</p>
            <div className="flex items-center gap-2 mb-2">
                {title.genres?.map((genre) => (
                    <Badge key={genre} variant="outline" className="rounded-full">{genre}</Badge>
                ))}
            </div>
            <p className="mb-4 text-yellow-500 font-medium">⭐ {title.averagerating} / 10</p>

            <h2 className="text-2xl font-bold">Directors</h2>
            <div className="flex flex-wrap items-center gap-x-2 mb-4">
                {crew
                    .filter((director) => director.role === "director")
                    .map((director) => (
                    <Link key={director.personid} href={`/person/${director.personid}`} className="hover:underline">
                        {director.primaryname}
                    </Link>
                ))}
            </div>

            <h2 className="text-2xl font-bold">Writers</h2>
            <div className="flex flex-wrap items-center gap-x-2 mb-4">
                {crew
                    .filter((writer) => writer.role === "writer")
                    .map((writer) => (
                        <Link key={writer.personid} href={`/person/${writer.personid}`} className="hover:underline">
                            {writer.primaryname}
                        </Link>
                    ))}
            </div>

            <h2 className="text-2xl font-bold">Stars</h2>
            <div className="flex flex-wrap items-center gap-x-2">
                {stars.map((star) => (
                    <Link key={star.personid} href={`/person/${star.personid}`} className="hover:underline">
                        {star.primaryname}
                    </Link>
                ))}
            </div>
        </div>
    );
}

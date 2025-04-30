import { query } from '@/lib/db';
import { notFound } from 'next/navigation';
import { Person, Title, TitleType, typeToString } from "@/app/lib/types";
import Link from "next/link";

interface Props {
    params: {
        id: string;
    };
}

export default async function PersonPage({ params }: Props) {
    const personId = parseInt((await params).id, 10);

    if (isNaN(personId)) {
        notFound();
    }

    const res = await query(
        `
    SELECT *
    FROM people
    WHERE personId = $1
    `,
        [personId]
    );

    const person: Person | undefined = res.rows[0];

    if (!person) {
        notFound();
    }

    const known_for_res = await query(
        `
        SELECT *
        FROM known_for
            JOIN titles USING (titleId)
        WHERE personId = $1
        `,
        [personId]
    )

    // Do a known for title look up with characters
    const known_for: Title[] = known_for_res.rows;

    return (
        <div className="max-w-2xl mx-auto p-6">
            <h1 className="text-4xl font-bold mb-4">{person.primaryname}</h1>
            <p className="text-accent-foreground mb-2 capitalize">{person.primaryprofession?.split(",").map((profession) => profession.split("_").join(" ")).join(" | ")}</p>
            {person.birthyear && (<p className="text-accent-foreground mb-2">Born in {person.birthyear}</p>)}
            {person.deathyear && (<p className="text-accent-foreground mb-2">Died in {person.deathyear}</p>)}

            <h2 className="text-2xl font-bold mt-2 mb-2">Known For</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {known_for
                    .map((title) => {
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
                            <Link key={title.titleid} href={`/title/${title.titleid}`}
                                  className="bg-card p-4 shadow-md rounded transition transform hover:scale-105 hover:shadow-lg">
                                <h2 className="text-xl font-semibold text-card-foreground">{title.primarytitle}</h2>
                                <h3 className="text-md text-muted-foreground mb-2">{info.join(" | ")}</h3>
                            </Link>
                        )
                    })}
            </div>
        </div>
    );
}

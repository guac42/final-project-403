import {query} from '@/lib/db';
import {notFound} from 'next/navigation';
import {Title, TitleType} from "@/app/lib/types";
import StarsSection from "@/components/stars-section";
import TitleHead from "@/components/title-head";
import CrewSection from "@/components/crew-section";
import EpisodesSection from "@/components/episodes-section";

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

    return (
        <div className="max-w-2xl mx-auto p-6">
            <TitleHead title={title} />
            <CrewSection titleId={titleId} />
            {(title.titletype == TitleType.TvSeries || title.titletype == TitleType.TvMiniSeries) && (<EpisodesSection titleId={titleId} />)}
            <StarsSection titleId={titleId} />
        </div>
    );
}

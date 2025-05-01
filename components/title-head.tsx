import {formatRuntime, Title, TitleType, typeToString} from "@/app/lib/types";
import {Badge} from "@/components/ui/badge";

export default function TitleHead({ title }: { title: Title }) {
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
        <>
            <h1 className="text-4xl font-bold mb-4">{title.primarytitle}</h1>
            <p className="text-accent-foreground mb-2">{info.join(" | ")}</p>
            <div className="flex items-center gap-2 mb-2">
                {title.genres?.map((genre) => (
                    <Badge key={genre} variant="outline" className="rounded-full">{genre}</Badge>
                ))}
            </div>
            <p className="mb-4 text-yellow-500 font-medium">⭐ {title.averagerating} / 10</p>
        </>
    );
}
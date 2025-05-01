export enum TitleType {
    Movie = "movie",
    Short = "short",
    TvEpisode = "tvEpisode",
    TvMiniSeries = "tvMiniSeries",
    TvMovie = "tvMovie",
    TvSeries = "tvSeries",
    TvShort = "tvShort",
    TvSpecial = "tvSpecial",
    Video = "video",
    VideoGame = "videoGame",
}

export interface Title {
    titleid: number;
    titletype: TitleType;
    primarytitle: string;
    originaltitle: string;
    isadult?: boolean;
    startyear?: number;
    endyear?: number;
    runtimeminutes?: number;
    genres?: string[];
    averagerating?: number;
    numvotes?: number;
}

export interface Person {
    personid: number;
    primaryname: string;
    birthyear?: number;
    deathyear?: number;
    primaryprofessions: string[];
}

export function typeToString(type: TitleType) {
    switch (type) {
        case TitleType.Movie:
            return "Movie";
        case TitleType.Short:
            return "Short";
        case TitleType.TvEpisode:
            return "TV Episode";
        case TitleType.TvMiniSeries:
            return "TV Mini Series";
        case TitleType.TvMovie:
            return "TV Movie";
        case TitleType.TvSeries:
            return "TV Series";
        case TitleType.TvShort:
            return "TV Short";
        case TitleType.TvSpecial:
            return "TV Special";
        case TitleType.Video:
            return "Video";
        case TitleType.VideoGame:
            return "Video Game";
    }
}

export function formatRuntime(minutes: number): string {
    if (minutes < 0) {
        throw new Error("Runtime cannot be negative.");
    }

    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;

    if (hours > 0 && remainingMinutes > 0) {
        return `${hours}h ${remainingMinutes}m`;
    } else if (hours > 0) {
        return `${hours}h`;
    } else {
        return `${remainingMinutes}m`;
    }
}
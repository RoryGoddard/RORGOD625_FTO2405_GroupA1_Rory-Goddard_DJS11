import { generateEpisodeId } from "./episodeIdGenerator";
import { dateAndTime } from "./dateAndTime";

export const getAllEpisodes = (show) => {
    if (!show || !Array.isArray(show.seasons)) {
        console.error('Invalid show structure:', show);
        return [];
    }
    console.log(show)
    return show.seasons.flatMap((season) => {
        if (Array.isArray(season.episodes)) {
            return season.episodes.map(episode => ({
                ...episode,
                episodeId: generateEpisodeId(show, season, episode),
                seasonTitle: season.title,
                seasonImage: season.image,
                season: season.season,
                showId: show.id,
                showTitle: show.title
            }));
        }
        console.error('Invalid season structure:', season);
        return [];
    });
};

export const findEpisodeIndex = (allEpisodes, currentEpisode) => {
    console.log("All episodes is the following:", allEpisodes)
    console.log("Current Episode passed in as args:", currentEpisode)
    return allEpisodes.findIndex(e => 
        e.episode === currentEpisode.episode && 
        (e.season === currentEpisode.season || e.season === undefined)
    );
};

export const episodeDetails = (show, season, episode) => {
    const episodeDetails = {
        episodeId: generateEpisodeId(show, season, episode),
        showId: show.id,
        showTitle: show.title,
        seasonTitle: season.title,
        season: season.season,
        title: episode.title,
        episode: episode.episode,
        description: episode.description,
        file: episode.file,
        updated: show.updated,
        savedAt: null
    }
    return episodeDetails
}

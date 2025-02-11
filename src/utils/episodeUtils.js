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
    return allEpisodes.findIndex(e => 
        e.episode === currentEpisode.episode && 
        (e.season === currentEpisode.season || e.season === undefined)
    );
};

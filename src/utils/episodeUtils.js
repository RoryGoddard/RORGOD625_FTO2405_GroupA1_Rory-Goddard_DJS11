export const getAllEpisodes = (show) => {
    if (!show || !Array.isArray(show.seasons)) {
        console.error('Invalid show structure:', show);
        return [];
    }
    return show.seasons.flatMap((season, seasonIndex) => {
        if (Array.isArray(season.episodes)) {
            return season.episodes.map(episode => ({
                ...episode,
                season: seasonIndex + 1 // Add season number to each episode
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

export function generateEpisodeId(show, selectedSeason, episode) {
    const episodeId = `${Number(show.id)}0${selectedSeason.season}0${episode.episode}`
    return Number(episodeId)
}
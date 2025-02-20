export function generateEpisodeId(episode) {
    const episodeId = `${Number(episode.showId)}0${episode.season}0${episode.episode}`
    return Number(episodeId)
}
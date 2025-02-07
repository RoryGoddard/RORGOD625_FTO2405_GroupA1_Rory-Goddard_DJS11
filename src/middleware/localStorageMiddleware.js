const localStorageMiddleware = store => next => action => {
    const result = next(action)

    if (action.type.startsWith("favourites/")) {
        const state = store.getState();
        localStorage.setItem("favourites", JSON.stringify(state.favourites));
    }

    if (action.type.startsWith("audioPlayer/saveTimestamp")) {
        const state = store.getState();
        localStorage.setItem("timestamps", JSON.stringify(state.audioPlayer.timestamps))
    }

    if (action.type.startsWith("audioPlayer/listenedEpisodes")) {
        const state = store.getState();
        localStorage.setItem("listenedEpisodes", JSON.stringify(state.audioPlayer.listenedEpisodes))
    }
    
    return result;
}

export default localStorageMiddleware
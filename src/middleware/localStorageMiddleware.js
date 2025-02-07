const localStorageMiddleware = store => next => action => {
    const result = next(action)

    if (action.type.startswith("/favourites")) {
        const state = store.getState();
        localStorage.setItem("favourites", JSON.stringify(state.favourites));
    }

    return result;
}

export default localStorageMiddleware
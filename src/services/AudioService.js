class AudioService {
    constructor() {
        const audioElement = new Audio();
        this.audio = audioElement;
        
        this.play = () => audioElement.play();
        this.pause = () => audioElement.pause();
        this.setSource = (src) => audioElement.src = src;
        this.setVolume = (volume) => audioElement.volume = volume;
        this.getDuration = () => audioElement.duration;
        this.getCurrentTime = () => audioElement.currentTime;
        this.setCurrentTime = (time) => audioElement.currentTime = time;

        // Event listeners
        this.onTimeUpdate = (callback) => audioElement.addEventListener('timeupdate', callback);
        this.onEnded = (callback) => audioElement.addEventListener('ended', callback);
        this.onLoadedData = (callback) => audioElement.addEventListener('loadeddata', callback);
    }
}

export const audioService = new AudioService();
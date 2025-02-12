class AudioService {
    constructor() {
        const audioElement = new Audio();
        this.play = () => audioElement.play();
        this.pause = () => audioElement.pause();
        this.setSource = (src) => audioElement.src = src;
        this.setVolume = (volume) => audioElement.volume = volume;
        this.duration = () => audioElement.duration;
        this.currentTime = () => audioElement.currentTime;

    }
}

export const audioService = new AudioService();
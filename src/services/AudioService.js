class AudioService {
    constructor() {
        const audioElement = new Audio();
        this.audio = audioElement;
        
        this.play = () => audioElement.play();
        this.pause = () => audioElement.pause();
        this.setVolume = (volume) => audioElement.volume = volume;
        this.getVolume = () => audioElement.volume;
        this.muted = () => audioElement.muted;
        this.getDuration = () => audioElement.duration;
        this.getCurrentTime = () => audioElement.currentTime;
        this.setCurrentTime = (time) => audioElement.currentTime = time;

        this.setSource = (src) => {
            audioElement.src = src;
            return new Promise((resolve) => {
                audioElement.addEventListener('loadedmetadata', () => {
                    resolve(audioElement.duration);
                }, { once: true });
            });
        };

        this.onTimeUpdate = (callback) => {
            audioElement.addEventListener('timeupdate', () => {
                callback(audioElement.currentTime);
            });
        };
    }
}

export const audioService = new AudioService();
import { persisted } from "svelte-persisted-store";

export const autoplay = persisted("autoplay", true);
export const startMuted = persisted("startMuted", false);
export const seekAmount = persisted("seekAmount", 10);
export const timeTillNext = persisted("timeTillNext", 0);
export const bareCards = persisted("bareCards", true);
export const subtitles = persisted("subtitles", false);

type Video = {
    id: string;
    title: string;
    thumbnail: string;
    uploader: {
        name: string;
        id: string;
        avatar: string;
        verified: boolean;
    };
    duration: number;
    uploadDate: Date | string | number;
    views: number;
};

export const queue = persisted("queue", Array<Video>(), { storage: "session" });

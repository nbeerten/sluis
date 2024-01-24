import Dexie, { type Table } from "dexie";

export interface Video {
    id?: string;
    progress: number;
    video: {
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
    watchedAt: Date;
}

export class VideoProgressDb extends Dexie {
    // 'friends' is added by dexie when declaring the stores()
    // We just tell the typing system this is the case
    videos!: Table<Video>;

    constructor() {
        super("video_progress");
        this.version(2).stores({
            videos: "&id, progress, watchedAt", // Primary key and indexed props
        });
    }
}

export const db = new VideoProgressDb();

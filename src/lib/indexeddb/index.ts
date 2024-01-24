import Dexie, { type Table } from "dexie";

export interface Video {
    id?: string;
    progress: number;
}

export class VideoProgressDb extends Dexie {
    // 'friends' is added by dexie when declaring the stores()
    // We just tell the typing system this is the case
    videos!: Table<Video>;

    constructor() {
        super("video_progress");
        this.version(1).stores({
            videos: "&id, progress", // Primary key and indexed props
        });
    }
}

export const db = new VideoProgressDb();

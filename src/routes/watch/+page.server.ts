import { PipedApi } from "$lib/api";
import { error } from "@sveltejs/kit";

export const load = async ({ fetch, url, cookies }) => {
    const videoId = url.searchParams.get("v");
    const instance = cookies.get("instance");
    const authToken = cookies.get("authToken");

    if (!videoId) {
        error(404, "Video not found");
    }

    const video = await PipedApi(fetch, instance).getStream({ videoId });
    const playlists = authToken
        ? await PipedApi(fetch, instance).getUserPlaylists({ authToken })
        : [];

    return {
        video: video,
        playlists,
    };
};

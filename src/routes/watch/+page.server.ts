import { PipedApi } from "$lib/api";
import { error } from "@sveltejs/kit";

export const load = async ({ fetch, url, cookies }) => {
    const videoId = url.searchParams.get("v");
    const instance = cookies.get("instance");
    const authToken = cookies.get("authToken");

    if (!videoId) {
        error(404, "Video not found");
    }

    const api = PipedApi(fetch, instance);

    const video = await api.getStream({ videoId });
    if ("message" in video) {
        error(404, video.message);
    }

    const playlists = authToken ? api.getUserPlaylists({ authToken }) : Promise.resolve([]);

    const asyncSponsors = async () => {
        const sponsorsettings = cookies.get("sponsorsettings");
        if (!sponsorsettings) {
            return false as const;
        }

        const categories = sponsorsettings.split(",").map((c) => c.slice("sponsor_".length));

        return api.getSponsors({ videoId, categories: categories });
    };

    const comments = api.getComments({ videoId });

    return {
        streamed: {
            comments,
            playlists,
        },
        video: video,
        sponsors: await asyncSponsors(),
    };
};

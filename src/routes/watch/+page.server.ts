import { error } from "@sveltejs/kit";
import { extract } from "$lib/cookies";

export const load = async ({ fetch, url, cookies, parent }) => {
    const { instances } = await parent();
    const { createPipedApi, sponsorsettings, authToken } = extract(cookies, instances);

    const videoId = url.searchParams.get("v");

    if (!videoId) {
        error(404, "Video not found");
    }

    const api = createPipedApi(fetch);

    const video = await api.getStream({ videoId });
    if ("message" in video) {
        error(404, video.message);
    }

    const playlists = authToken ? api.getUserPlaylists({ authToken }) : Promise.resolve([]);

    const categories = sponsorsettings
        ? sponsorsettings.split(",").map((c) => c.slice("sponsor_".length))
        : [];

    const sponsors = api.getSponsors({ videoId, categories });

    const comments = api.getComments({ videoId });

    return {
        streamed: {
            comments,
            playlists,
            sponsors,
        },
        video: video,
    };
};

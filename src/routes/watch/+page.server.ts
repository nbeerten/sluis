import { error } from "@sveltejs/kit";

export const load = async ({ fetch, url, locals }) => {
    const videoId = url.searchParams.get("v");

    if (!videoId) {
        error(404, { message: "Video not found" });
    }

    const api = locals.createPipedApi(fetch);

    const video = await api.getStream({ videoId });
    if ("message" in video) {
        throw error(404, { message: video.message });
    }

    try {
        const playlists = locals.authToken
            ? api.getUserPlaylists({ authToken: locals.authToken })
            : Promise.resolve([]);

        const categories = locals.sponsorsettings
            ? locals.sponsorsettings.split(",").map((c) => c.slice("sponsor_".length))
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
    } catch (err) {
        return error(500, {
            message: `${(err as Error).name}: ${(err as Error).message}`,
            stack: (err as Error).stack,
        });
    }
};

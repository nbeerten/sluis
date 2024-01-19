import { error } from "@sveltejs/kit";
import { extract } from "$lib/cookies";

export const load = async ({ fetch, url, cookies }) => {
    const { createPipedApi } = extract(cookies);

    const query = url.searchParams.get("q");
    if (!query) {
        error(404, { message: "Please provide a search query" });
    }
    const filter = url.searchParams.get("filter") ?? "videos";

    if (!filter || ["videos", "channels", "playlists"].includes(filter ?? "") === false) {
        error(404, { message: "Please provide a search filter" });
    }

    const api = createPipedApi(fetch);
    const results = await api.getSearch({ query, filter });

    return {
        results,
    };
};

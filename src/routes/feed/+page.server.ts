import { extract } from "$lib/cookies";

export const load = async ({ fetch, cookies, parent }) => {
    const { loggedIn } = await parent();
    if (!loggedIn) {
        return { loggedIn };
    }

    const { createPipedApi, authToken } = extract(cookies);
    if (!authToken) {
        return { loggedIn };
    }

    return {
        videos: await createPipedApi(fetch).getFeed({ authToken }),
    };
};

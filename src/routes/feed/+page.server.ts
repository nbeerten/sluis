import { PipedApi } from "$lib/api";

export const load = async ({ fetch, cookies, parent }) => {
    const instance = cookies.get("instance");
    const { loggedIn } = await parent();
    if (!loggedIn) {
        return { loggedIn };
    }

    const authToken = cookies.get("authToken") as string;

    return {
        videos: await PipedApi(fetch, instance).getFeed({ authToken }),
    };
};

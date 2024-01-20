export const load = async ({ fetch, locals, parent }) => {
    const { loggedIn } = await parent();
    if (!loggedIn) {
        return { loggedIn };
    }

    if (!locals.authToken) {
        return { loggedIn };
    }

    return {
        videos: await locals.createPipedApi(fetch).getFeed({ authToken: locals.authToken }),
    };
};

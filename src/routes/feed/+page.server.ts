export const load = async ({ fetch, locals }) => {
    if (!locals.authToken) {
        return { loggedIn: false };
    }

    return {
        videos: await locals.createPipedApi(fetch).getFeed({ authToken: locals.authToken }),
    };
};

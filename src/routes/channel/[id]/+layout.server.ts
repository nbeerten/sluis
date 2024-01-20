export const load = async ({ fetch, params, locals }) => {
    const api = locals.createPipedApi(fetch);
    const channel = await api.getChannel({ channelId: params.id });
    return {
        channel,
        isSubscribed: locals.authToken
            ? await api.getSubscribed({ authToken: locals.authToken, channelId: params.id })
            : { subscribed: false },
    };
};

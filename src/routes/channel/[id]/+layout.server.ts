export const load = async ({ fetch, params, locals }) => {
    const api = locals.createPipedApi(fetch);

    const channelPromise = await api.getChannel({ channelId: params.id });
    const isSubscribedPromise = locals.authToken
        ? api.getSubscribed({ authToken: locals.authToken, channelId: params.id })
        : ({ subscribed: false } as const);

    const [channel, isSubscribed] = await Promise.all([channelPromise, isSubscribedPromise]);

    return {
        channel,
        isSubscribed,
    };
};

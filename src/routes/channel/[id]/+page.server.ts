export const actions = {
    subscribe: async ({ fetch, params, locals }) => {
        if (!locals.authToken) {
            return {
                success: false,
            };
        }
        const api = locals.createPipedApi(fetch);
        await api.postSubscribe({ authToken: locals.authToken, channelId: params.id });

        return {
            success: true,
        };
    },

    unsubscribe: async ({ fetch, params, locals }) => {
        if (!locals.authToken) {
            return {
                success: false,
            };
        }
        const api = locals.createPipedApi(fetch);
        await api.postUnsubscribe({ authToken: locals.authToken, channelId: params.id });

        return {
            success: true,
        };
    },
};

export const load = async ({ parent }) => {
    const { channel, isSubscribed } = await parent();
    return {
        channel,
        isSubscribed,
    };
};

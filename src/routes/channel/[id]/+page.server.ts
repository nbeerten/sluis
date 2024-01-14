import { PipedApi } from '$lib/api';

export const actions = {
    subscribe: async ({ fetch, params, cookies }) => {
        const authToken = cookies.get('authToken');
        const instance = cookies.get('instance');

        if (!authToken) {
            return {
                success: false
            };
        }
        const api = PipedApi(fetch, instance);
        await api.postSubscribe({ authToken, channelId: params.id });

        return {
            success: true
        };
    },

    unsubscribe: async ({ fetch, params, cookies }) => {
        const authToken = cookies.get('authToken');
        const instance = cookies.get('instance');
        if (!authToken) {
            return {
                success: false
            };
        }
        const api = PipedApi(fetch, instance);
        await api.postUnsubscribe({ authToken, channelId: params.id });

        return {
            success: true
        };
    }
};

export const load = async ({ fetch, params, cookies }) => {
    const authToken = cookies.get('authToken');
    const instance = cookies.get('instance');
    const api = PipedApi(fetch, instance);
    const channel = await api.getChannel({ channelId: params.id });
    return {
        channel,
        isSubscribed: authToken
            ? await api.getSubscribed({ authToken, channelId: params.id })
            : { subscribed: false }
    };
};

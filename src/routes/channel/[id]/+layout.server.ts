import { PipedApi } from "$lib/api";

export const load = async ({ fetch, params, cookies }) => {
    const authToken = cookies.get("authToken");
    const instance = cookies.get("instance");
    const api = PipedApi(fetch, instance);
    const channel = await api.getChannel({ channelId: params.id });
    return {
        channel,
        isSubscribed: authToken
            ? await api.getSubscribed({ authToken, channelId: params.id })
            : { subscribed: false },
    };
};

import { extract } from "$lib/cookies";

export const load = async ({ fetch, params, cookies }) => {
    const { createPipedApi, authToken } = extract(cookies);
    const api = createPipedApi(fetch);
    const channel = await api.getChannel({ channelId: params.id });
    return {
        channel,
        isSubscribed: authToken
            ? await api.getSubscribed({ authToken, channelId: params.id })
            : { subscribed: false },
    };
};

import { PipedApi } from '$lib/api';

export const load = async ({ fetch, params }) => {
    return {
        channel: await PipedApi(fetch).getChannel({ channelId: params.id })
    };
};

import { PipedApi } from '$lib/api';

export const load = async ({ fetch }) => {
    return {
        videos: await PipedApi(fetch).getTrending({ region: 'NL' })
    };
};

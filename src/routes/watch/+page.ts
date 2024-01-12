import { PipedApi } from '$lib/api';
import { error } from '@sveltejs/kit';

export const load = async ({ fetch, url }) => {
    const videoId = url.searchParams.get('v');

    if (!videoId) {
        error(404, 'Video not found');
    }

    return {
        video: await PipedApi(fetch).getStream({ videoId })
    };
};

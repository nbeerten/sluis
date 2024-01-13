import { PipedApi } from '$lib/api';
import { error } from '@sveltejs/kit';

export const load = async ({ fetch, url, cookies }) => {
    const videoId = url.searchParams.get('v');
    const instance = cookies.get('instance');

    if (!videoId) {
        error(404, 'Video not found');
    }

    return {
        video: await PipedApi(fetch, instance).getStream({ videoId })
    };
};

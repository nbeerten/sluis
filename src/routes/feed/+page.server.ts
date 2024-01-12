import { PipedApi } from '$lib/api';
import { fail } from '@sveltejs/kit';

export const load = async ({ fetch, cookies }) => {
    const authToken = cookies.get('authToken');

    if (!authToken) {
        return fail(401, { message: 'Log in to see your feed' });
    }

    return {
        videos: await PipedApi(fetch).getFeed({ authToken })
    };
};

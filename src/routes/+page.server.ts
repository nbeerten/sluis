import { PipedApi } from '$lib/api';

export const actions = {
    switchInstance: async ({ cookies, request }) => {
        const data = await request.formData();
        const cookiesInstance = cookies.get('instance');
        const instance = data.get('instance')?.toString();
        if (!instance) {
            return {
                success: false
            };
        }
        if (cookiesInstance === instance) {
            return {
                success: true
            };
        }

        cookies.set('instance', instance, { path: '/', httpOnly: false });
        cookies.set('authToken', '', { expires: new Date(0), path: '/' });

        return {
            success: true
        };
    }
};

export const load = async ({ fetch, cookies }) => {
    const instance = cookies.get('instance');
    return {
        videos: await PipedApi(fetch, instance).getTrending({ region: 'NL' })
    };
};

import { PipedApi } from '$lib/api/index.js';

export async function load({ fetch, cookies }) {
    const authToken = cookies.get('authToken');
    const instance = cookies.get('instance');

    if (!authToken) {
        return {
            subscriptions: false as const
        };
    }

    const subscriptions = await PipedApi(fetch, instance).getSubscriptions({ authToken });

    return {
        subscriptions
    };
}

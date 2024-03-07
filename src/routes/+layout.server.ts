import { cachedInstances } from "$lib/api/instances";

export async function load({ fetch, locals }) {
    try {
        const instancesPromise = cachedInstances();

        const subscriptionsPromise = locals.authToken
            ? locals.createPipedApi(fetch).getSubscriptions({ authToken: locals.authToken })
            : (false as const);

        const [instances, subscriptions] = await Promise.all([
            instancesPromise,
            subscriptionsPromise,
        ]);

        return {
            subscriptions,
            instance: {
                url: locals.instance,
                ...(instances.find((i) => i.api_url === locals.instance) || {}),
            },
            instances,
            loggedIn: !!locals.authToken,
        };
    } catch {
        return {
            subscriptions: [],
            instance: {
                url: null,
                name: null,
                api_url: null,
                locations: null,
                version: null,
                up_to_date: null,
                cdn: null,
                registered: null,
                last_checked: null,
                cache: null,
                s3_enabled: null,
                image_proxy_url: null,
                registration_disabled: null,
                uptime_24h: null,
                uptime_7d: null,
                uptime_30d: null,
            },
            instances: [],
            loggedIn: false,
        };
    }
}

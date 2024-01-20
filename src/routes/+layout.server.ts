import { getInstances } from "$lib/api";

export async function load({ fetch, locals }) {
    try {
        const instances = await getInstances();

        const subscriptions = locals.authToken
            ? await locals.createPipedApi(fetch).getSubscriptions({ authToken: locals.authToken })
            : (false as const);

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

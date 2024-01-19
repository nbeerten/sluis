import { getInstances } from "$lib/api";
import { extract } from "$lib/cookies";

export async function load({ fetch, cookies }) {
    try {
        const instances = await getInstances();
        const { authToken, instance, createPipedApi } = extract(cookies);

        const subscriptions = authToken
            ? await createPipedApi(fetch).getSubscriptions({ authToken })
            : (false as const);

        return {
            subscriptions,
            instance: {
                url: instance,
                ...(instances.find((i) => i.api_url === instance) || {}),
            },
            instances,
            loggedIn: !!authToken,
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
                uptime_30d: null
            },
            instances: [],
            loggedIn: false,
        };
    }
}

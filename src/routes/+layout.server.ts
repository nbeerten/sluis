import { getInstances } from "$lib/api";
import { extract } from "$lib/cookies";

export async function load({ fetch, cookies }) {
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
}

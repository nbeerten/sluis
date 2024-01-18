import { getInstances } from "$lib/api";
import { cookiesExtract } from "$lib/cookiesExtract";

export async function load({ fetch, cookies }) {
    const { authToken, instance, createPipedApi } = cookiesExtract(cookies);

    const instanceList = await getInstances();
    const subscriptions = authToken
        ? await createPipedApi(fetch).getSubscriptions({ authToken })
        : (false as const);

    return {
        subscriptions,
        instance: {
            url: instance,
        },
        instanceList,
        loggedIn: !!authToken,
    };
}

import { PipedApi, getInstances, defaultInstance } from "$lib/api";

export async function load({ fetch, cookies }) {
    const authToken = cookies.get("authToken");
    const instance = cookies.get("instance");

    const instanceList = await getInstances();
    const subscriptions = authToken
        ? await PipedApi(fetch, instance).getSubscriptions({ authToken })
        : (false as const);

    return {
        subscriptions,
        instance: {
            url: instance ?? defaultInstance,
        },
        instanceList,
        loggedIn: !!authToken,
    };
}

import { extract } from "$lib/cookies";

export async function load({ fetch, parent, cookies }) {
    const { channel, instances } = await parent();
    const { createPipedApi } = extract(cookies, instances);

    const shortsTab = channel.tabs.find((tab) => tab.name === "shorts");

    if (!shortsTab) {
        return {
            channel,
            shorts: {
                nextpage: "",
                content: [],
            },
        };
    }

    const shorts = await createPipedApi(fetch).getChannelTab({
        data: shortsTab.data,
    });

    return {
        channel,
        shorts,
    };
}

import { cookiesExtract } from "$lib/cookiesExtract";

export async function load({ fetch, parent, cookies }) {
    const { createPipedApi } = cookiesExtract(cookies);
    const { channel } = await parent();

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

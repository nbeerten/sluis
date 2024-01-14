import { PipedApi } from "$lib/api";

export async function load({ fetch, parent, cookies }) {
    const instance = cookies.get("instance");
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

    const shorts = await PipedApi(fetch, instance).getChannelTab({
        data: shortsTab.data,
    });

    return {
        channel,
        shorts,
    };
}

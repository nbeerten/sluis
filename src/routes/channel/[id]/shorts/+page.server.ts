export async function load({ fetch, parent, locals }) {
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

    const shorts = await locals.createPipedApi(fetch).getChannelTab({
        data: shortsTab.data,
    });

    return {
        channel,
        shorts,
    };
}

import { cookiesExtract } from "$lib/cookiesExtract";

export async function load({ fetch, parent, cookies }) {
    const { channel } = await parent();
    const { createPipedApi } = cookiesExtract(cookies);

    const livestreamsTab = channel.tabs.find((tab) => tab.name === "livestreams");

    if (!livestreamsTab) {
        return {
            channel,
            livestreams: {
                nextpage: "",
                content: [],
            },
        };
    }

    const livestreams = await createPipedApi(fetch).getChannelTab({
        data: livestreamsTab.data,
    });

    return {
        channel,
        livestreams,
    };
}

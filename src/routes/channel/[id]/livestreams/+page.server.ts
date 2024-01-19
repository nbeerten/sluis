import { extract } from "$lib/cookies";

export async function load({ fetch, parent, cookies }) {
    const { channel, instances } = await parent();
    const { createPipedApi } = extract(cookies, instances);

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

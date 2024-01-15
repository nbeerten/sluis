import { PipedApi } from "$lib/api";

export async function load({ fetch, parent, cookies }) {
    const instance = cookies.get("instance");
    const { channel } = await parent();

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

    const livestreams = await PipedApi(fetch, instance).getChannelTab({
        data: livestreamsTab.data,
    });

    return {
        channel,
        livestreams,
    };
}

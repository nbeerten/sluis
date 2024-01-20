export async function load({ fetch, parent, locals }) {
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

    const livestreams = await locals.createPipedApi(fetch).getChannelTab({
        data: livestreamsTab.data,
    });

    return {
        channel,
        livestreams,
    };
}

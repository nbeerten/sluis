export async function load({ fetch, parent, locals }) {
    const { channel } = await parent();

    const playlistsTab = channel.tabs.find((tab) => tab.name === "playlists");

    if (!playlistsTab) {
        return {
            channel,
            playlists: {
                nextpage: "",
                content: [],
            },
        };
    }

    const playlists = await locals.createPipedApi(fetch).getChannelTab({
        data: playlistsTab.data,
    });

    return {
        channel,
        playlists,
    };
}

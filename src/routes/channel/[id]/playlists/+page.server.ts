import { cookiesExtract } from "$lib/cookiesExtract";

export async function load({ fetch, parent, cookies }) {
    const { channel } = await parent();
    const { createPipedApi } = cookiesExtract(cookies);

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

    const playlists = await createPipedApi(fetch).getChannelTab({
        data: playlistsTab.data,
    });

    return {
        channel,
        playlists,
    };
}

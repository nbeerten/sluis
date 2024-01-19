import { extract } from "$lib/cookies";

export async function load({ fetch, parent, cookies }) {
    const { channel, instances } = await parent();
    const { createPipedApi } = extract(cookies, instances);

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

import { PipedApi } from "$lib/api";

export async function load({ fetch, parent, cookies }) {
    const instance = cookies.get("instance");
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

    const playlists = await PipedApi(fetch, instance).getChannelTab({
        data: playlistsTab.data,
    });

    return {
        channel,
        playlists,
    };
}

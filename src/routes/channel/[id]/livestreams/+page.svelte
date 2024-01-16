<script lang="ts">
    import VideoCard from "$lib/components/video-card.svelte";
    import { PipedApi } from "$lib/api";
    import type { channels_tabs_items_livestreams } from "$lib/api/types";
    import InfiniteScroll from "$lib/components/infinite-scroll.svelte";
    import SEO from "$lib/components/seo";

    export let data;
    let { channel, livestreams } = data;
    $: channel = data.channel;
    $: livestreams = data.livestreams;

    $: channel, resetVideos();

    function resetVideos() {
        videos = [];
        newBatch = livestreams.content as channels_tabs_items_livestreams;
        nextpageToken = channel.nextpage;
    }

    let nextpageToken = livestreams.nextpage;
    $: nextpageToken = livestreams.nextpage;

    let videos: channels_tabs_items_livestreams = [];
    let newBatch = livestreams.content as channels_tabs_items_livestreams;

    async function fetchMoreVideos() {
        if (!nextpageToken) return;
        const response = await PipedApi().getChannelTab({
            data: channel.tabs.find((t) => t.name === "livestreams")?.data as string,
            nextpage: nextpageToken,
        });
        newBatch = response.content as channels_tabs_items_livestreams;
        nextpageToken = response.nextpage;
    }

    $: videos = [...videos, ...newBatch];
</script>

<SEO title={channel.name} />

<div class="mb-5 grid grid-cols-1 gap-4 pt-5 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
    {#each videos as video}
        <VideoCard
            video={{
                id: video.url.slice(9),
                title: video.title,
                thumbnail: video.thumbnail,
                uploader: {
                    name: video.uploaderName,
                    id: video.uploaderUrl.slice(9),
                    avatar: channel.avatarUrl,
                    verified: video.uploaderVerified,
                },
                duration: video.duration,
                uploadDate: video.uploaded,
                views: video.views,
            }}
            showChannel={false} />
    {/each}
</div>
<InfiniteScroll
    hasMore={newBatch.length > 0}
    onLoadMore={() => {
        fetchMoreVideos();
    }} />

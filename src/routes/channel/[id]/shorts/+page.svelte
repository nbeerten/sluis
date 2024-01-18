<script lang="ts">
    import VideoCard from "$lib/components/video-card.svelte";
    import { PipedApi } from "$lib/api";
    import type { channels_tabs_items_shorts } from "$lib/api/types";
    import InfiniteScroll from "$lib/components/infinite-scroll.svelte";
    import SEO from "$lib/components/seo";

    export let data;
    let { channel, shorts } = data;
    $: channel = data.channel;
    $: shorts = data.shorts;

    $: channel, resetVideos();

    function resetVideos() {
        videos = [];
        newBatch = shorts.content as channels_tabs_items_shorts;
        nextpageToken = channel.nextpage;
    }

    let nextpageToken = shorts.nextpage;
    $: nextpageToken = shorts.nextpage;

    let videos: channels_tabs_items_shorts = [];
    let newBatch = shorts.content as channels_tabs_items_shorts;

    async function fetchMoreVideos() {
        if (!nextpageToken) return;
        const response = await PipedApi().getChannelTab({
            data: channel.tabs.find((t) => t.name === "shorts")?.data as string,
            nextpage: nextpageToken,
        });
        newBatch = response.content as channels_tabs_items_shorts;
        nextpageToken = response.nextpage;
    }

    $: videos = [...videos, ...newBatch];
</script>

<SEO title={channel.name} robots={["noindex", "nofollow"]} />

<div
    class="mb-5 grid grid-cols-2 gap-4 pt-5 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6">
    {#each videos as video, i}
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
            lazyImage={i >= 8}
            isShort
            bareCard
            showChannel={false} />
    {/each}
</div>
<InfiniteScroll
    hasMore={newBatch.length > 0}
    onLoadMore={() => {
        fetchMoreVideos();
    }} />

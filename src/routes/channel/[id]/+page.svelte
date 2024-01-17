<script lang="ts">
    import VideoCard from "$lib/components/video-card.svelte";
    import { PipedApi } from "$lib/api";
    import InfiniteScroll from "$lib/components/infinite-scroll.svelte";
    import SEO from "$lib/components/seo";

    export let data;
    let { channel } = data;
    $: channel = data.channel;

    $: channel, resetVideos();

    function resetVideos() {
        videos = [];
        newBatch = channel.relatedStreams;
        nextpageToken = channel.nextpage;
    }

    let nextpageToken = channel.nextpage;
    $: nextpageToken = channel.nextpage;

    let videos: Awaited<ReturnType<ReturnType<typeof PipedApi>["getChannel"]>>["relatedStreams"] =
        [];
    let newBatch = channel.relatedStreams;

    async function fetchMoreVideos() {
        if (!nextpageToken) return;
        const response = await PipedApi().getChannel({
            channelId: channel.id,
            nextpage: nextpageToken,
        });
        newBatch = response.relatedStreams;
        nextpageToken = response.nextpage;
    }

    $: videos = [...videos, ...newBatch];
</script>

<SEO title={channel.name} robots={["noindex", "nofollow"]} />

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

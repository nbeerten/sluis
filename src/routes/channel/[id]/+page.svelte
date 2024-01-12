<script lang="ts">
    import VideoCard from '$lib/components/video-card.svelte';
    import { PipedApi } from '$lib/api';
    import { Button } from '$lib/components/ui/button';
    import InfiniteScroll from '$lib/components/infinite-scroll.svelte';
    export let data;

    let { channel } = data;
    $: channel = data.channel;

    $: channel, resetVideos();

    function resetVideos() {
        videos = [];
        newBatch = channel.relatedStreams;
        nextpageToken = channel.nextpage;
    }

    const { format } = Intl.NumberFormat('en', {
        notation: 'compact'
    });

    let nextpageToken = channel.nextpage;
    $: nextpageToken = channel.nextpage;

    let videos: Awaited<ReturnType<ReturnType<typeof PipedApi>['getChannel']>>['relatedStreams'] =
        [];
    let newBatch = channel.relatedStreams;

    async function fetchMoreVideos() {
        const response = await PipedApi().getChannel({
            channelId: channel.id,
            nextpage: nextpageToken
        });
        newBatch = response.relatedStreams;
        nextpageToken = response.nextpage;
    }

    $: videos = [...videos, ...newBatch];
</script>

<main>
    <hgroup class="space-y-4">
        <div class="overflow-hidden rounded-2xl bg-primary-foreground [aspect-ratio:6/1]">
            <img src={channel.bannerUrl} alt="Banner" class="h-full w-full object-contain" />
        </div>
        <div class="flex items-center justify-between">
            <div class="flex items-center gap-4">
                <img src={channel.avatarUrl} alt="Avatar" class="h-20 w-20 rounded-full" />
                <div>
                    <h1 class="text-2xl font-bold">
                        {channel.name}
                    </h1>
                    <p class="text-sm text-muted-foreground">
                        {format(channel.subscriberCount)} subscribers
                    </p>
                </div>
            </div>
            <div>
                <Button variant="secondary">Subscribe</Button>
            </div>
        </div>
    </hgroup>

    <div class="mb-5 grid grid-cols-1 gap-4 py-5 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
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
                        verified: video.uploaderVerified
                    },
                    duration: video.duration,
                    uploadDate: video.uploaded,
                    views: video.views
                }}
            />
        {/each}
        <InfiniteScroll
            hasMore={newBatch.length > 0}
            on:loadMore={() => {
                fetchMoreVideos();
            }}
        />
    </div>
</main>

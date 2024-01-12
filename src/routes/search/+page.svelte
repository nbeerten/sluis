<script lang="ts">
    import VideoCard from '$lib/components/video-card.svelte';
    import { page } from '$app/stores';
    import { PipedApi } from '$lib/api';
    import { Tabs, TabsContent, TabsList, TabsTrigger } from '$lib/components/ui/tabs';
    import InfiniteScroll from '$lib/components/infinite-scroll.svelte';

    export let data;
    let { results } = data;
    $: results = data.results;

    $: results, resetResults();

    function resetResults() {
        videos = [];
        newBatch = results.items;
        nextpageToken = results.nextpage;
    }

    let nextpageToken = results.nextpage;
    $: nextpageToken = results.nextpage;

    let videos: Awaited<ReturnType<ReturnType<typeof PipedApi>['getSearch']>>['items'] = [];
    let newBatch = results.items;

    async function fetchMoreResults() {
        const response = await PipedApi().getSearch({
            query: $page.url.searchParams.get('q') ?? '',
            filter: $page.url.searchParams.get('filter') ?? 'videos',
            nextpage: nextpageToken
        });
        newBatch = response.items;
        nextpageToken = response.nextpage;
    }

    $: videos = [...videos, ...newBatch];
</script>

<main>
    <hgroup>
        <h1 class="text-3xl font-bold">Search: {$page.url.searchParams.get('q')}</h1>
    </hgroup>
    <div class="grid grid-cols-1 gap-4 py-5 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
        {#each videos as video}
            {#if video.type === 'stream'}
                <VideoCard
                    video={{
                        id: video.url.slice(9),
                        title: video.title,
                        thumbnail: video.thumbnail,
                        uploader: {
                            name: video.uploaderName,
                            id: video.uploaderUrl.slice(9),
                            avatar: video.uploaderAvatar,
                            verified: video.uploaderVerified
                        },
                        duration: video.duration,
                        uploadDate: video.uploaded,
                        views: video.views
                    }}
                />
            {/if}
        {/each}
        <InfiniteScroll
            hasMore={newBatch.length > 0}
            on:loadMore={() => {
                fetchMoreResults();
            }}
        />
    </div>
</main>

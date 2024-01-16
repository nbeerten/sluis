<script lang="ts">
    import VideoCard from "$lib/components/video-card.svelte";
    import { page } from "$app/stores";
    import { PipedApi } from "$lib/api";
    import InfiniteScroll from "$lib/components/infinite-scroll.svelte";
    import * as Select from "$lib/components/ui/select";
    import ChannelCard from "$lib/components/channel-card.svelte";
    import { goto } from "$app/navigation";
    import SEO from "$lib/components/seo";

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

    let videos: Awaited<ReturnType<ReturnType<typeof PipedApi>["getSearch"]>>["items"] = [];
    let newBatch = results.items;

    async function fetchMoreResults() {
        const response = await PipedApi().getSearch({
            query: $page.url.searchParams.get("q") ?? "",
            filter: $page.url.searchParams.get("filter") ?? "videos",
            nextpage: nextpageToken,
        });
        newBatch = response.items;
        nextpageToken = response.nextpage;
    }

    $: videos = [...videos, ...newBatch];

    const filters = [
        { value: "videos", label: "Videos" } as const,
        { value: "channels", label: "Channels" } as const,
        { value: "playlists", label: "Playlists" } as const,
    ];
</script>

<SEO title="Search: {$page.url.searchParams.get('q')}" />

<main>
    <hgroup class="flex justify-between">
        <h1 class="text-3xl font-bold">Search: {$page.url.searchParams.get("q")}</h1>
        <Select.Root
            items={filters}
            selected={filters.find(
                (f) => f.value === ($page.url.searchParams.get("filter") || "videos")
            )}
            preventScroll={false}
            onSelectedChange={(selected) =>
                goto(
                    `/search?${new URLSearchParams({
                        q: $page.url.searchParams.get("q") ?? "",
                        filter: selected?.value ?? "videos",
                    })}`
                )}>
            <Select.Trigger class="w-40">
                <Select.Value placeholder="Filter" />
            </Select.Trigger>
            <Select.Content class="z-0">
                <Select.Label>Filters</Select.Label>
                {#each filters as filter}
                    <Select.Item value={filter.value} label={filter.label}>
                        {filter.label}
                    </Select.Item>
                {/each}
            </Select.Content>
        </Select.Root>
    </hgroup>
    <div class="grid grid-cols-1 gap-4 pt-5 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
        {#each videos as item}
            {#if item.type === "stream"}
                <VideoCard
                    video={{
                        id: item.url.slice(9),
                        title: item.title,
                        thumbnail: item.thumbnail,
                        uploader: {
                            name: item.uploaderName,
                            id: item.uploaderUrl.slice(9),
                            avatar: item.uploaderAvatar,
                            verified: item.uploaderVerified,
                        },
                        duration: item.duration,
                        uploadDate: item.uploaded,
                        views: item.views,
                    }} />
            {:else if item.type === "channel"}
                <ChannelCard channel={{ ...item, id: item.url.slice(9) }} />
            {/if}
        {/each}
    </div>
    <InfiniteScroll
        hasMore={newBatch.length > 0}
        onLoadMore={() => {
            fetchMoreResults();
        }} />
</main>

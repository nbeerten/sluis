<script lang="ts">
    import VideoCard from "$lib/components/video-card.svelte";
    import { PipedApi } from "$lib/api";
    import type { channels_tabs_items_livestreams } from "$lib/api/types";
    import InfiniteScroll from "$lib/components/infinite-scroll.svelte";
    import SEO from "$lib/components/seo";
    import type { Snapshot } from "./$types.js";
    import { tick } from "svelte";
    import { bareCards } from "$lib/stores";

    export let data;
    let { channel, livestreams } = data;
    $: channel = data.channel;
    $: livestreams = data.livestreams;

    $: channel, resetVideos();

    function resetVideos() {
        videos = livestreams.content as channels_tabs_items_livestreams;
        nextpageToken = channel.nextpage;
    }

    let scrollY: number;
    let shouldScrollTo: number;
    let shouldScrollBack = false;

    let nextpageToken = livestreams.nextpage;
    $: nextpageToken = livestreams.nextpage;

    let videos = livestreams.content as channels_tabs_items_livestreams;

    let prevBatchLength = +Infinity;

    async function fetchMoreVideos() {
        if (!nextpageToken) return;
        const response = await PipedApi().getChannelTab({
            data: channel.tabs.find((t) => t.name === "livestreams")?.data as string,
            nextpage: nextpageToken,
        });
        videos = [...videos, ...(response.content as channels_tabs_items_livestreams)];
        prevBatchLength = response.content.length;
        nextpageToken = response.nextpage;
    }

    export const snapshot: Snapshot<{
        videos: channels_tabs_items_livestreams;
        nextpageToken: string;
        prevBatchLength: number;
        scrollY: number;
    }> = {
        capture: () => {
            return {
                videos,
                nextpageToken,
                prevBatchLength,
                scrollY,
            };
        },
        restore: (captured) => {
            videos = captured.videos;
            nextpageToken = captured.nextpageToken;
            prevBatchLength = captured.prevBatchLength;

            shouldScrollTo = captured.scrollY;
            shouldScrollBack = true;

            if (shouldScrollBack && shouldScrollTo !== null) {
                tick().then(() => window.scrollTo({ top: shouldScrollTo }));
            }
        },
    };
</script>

<SEO title={channel.name} robots={["noindex", "nofollow"]} />

<svelte:window bind:scrollY />

<div class="mb-5 grid grid-cols-1 gap-4 pt-5 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
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
            bareCard={$bareCards}
            showChannel={false} />
    {/each}
</div>
<InfiniteScroll
    hasMore={prevBatchLength > 0}
    onLoadMore={() => {
        fetchMoreVideos();
    }} />

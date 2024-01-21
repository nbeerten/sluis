<script lang="ts">
    import { PipedApi } from "$lib/api";
    import type { comments_videoId, streams_videoId } from "$lib/api/types";
    import InfiniteScroll from "$lib/components/infinite-scroll.svelte";
    import Comment from "$lib/components/comment.svelte";

    export let comments: comments_videoId;
    export let video: streams_videoId;
    export let videoId: string | null;

    let nextpageToken = comments.nextpage;
    $: nextpageToken = comments.nextpage;

    let commentsList = comments.comments;

    let prevBatchLength = +Infinity;

    async function fetchMoreComments() {
        if (!nextpageToken || !videoId) return;
        const response = await PipedApi().getComments({
            videoId,
            nextpage: nextpageToken,
        });
        commentsList = [...commentsList, ...response.comments];
        prevBatchLength = response.comments.length;
        nextpageToken = response.nextpage;
    }

    const { format: formatNumber } = Intl.NumberFormat("en", { notation: "compact" });
</script>

{#if comments.comments && comments.comments.length > 0 && "uploader" in video}
    <h2 class="text-xl font-semibold">
        Comments ({formatNumber(comments.commentCount)})
    </h2>
    <div class="flex flex-col gap-4">
        {#each commentsList as comment}
            <Comment {comment} channelName={video.uploader} />
        {/each}
        <InfiniteScroll
            hasMore={prevBatchLength > 0}
            onLoadMore={() => {
                fetchMoreComments();
            }} />
    </div>
{/if}

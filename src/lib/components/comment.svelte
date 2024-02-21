<script lang="ts">
    import { page } from "$app/stores";
    import type { comments_videoId } from "$lib/api/types";
    import { Avatar, AvatarFallback, AvatarImage } from "$lib/components/ui/avatar";
    import ThumbsUp from "~icons/lucide/thumbs-up";
    import Pin from "~icons/lucide/pin";
    import Check from "~icons/lucide/check";
    import Heart from "~icons/lucide/heart";
    import { Button } from "$lib/components/ui/button";
    import { PipedApi } from "$lib/api";
    import { slide } from "svelte/transition";

    export let comment: comments_videoId["comments"][number];
    export let channelName: string;

    function extractTimestamps(commentText: string | null) {
        if (!commentText) return commentText;

        const timeStampRegex =
            /(<a href="https:\/\/www.youtube.com\/watch\?v=[a-zA-Z0-9_-]{11}(?:&amp;t=([0-9]+))?">([0-9:]+)<\/a>)/gi;
        const newComment = commentText.replaceAll(
            timeStampRegex,
            `<a href="/watch?v=${$page.url.searchParams.get("v")}&t=$2">$3</a>`
        );

        return newComment;
    }

    let replies: comments_videoId["comments"] = [];
    let nextPageReplies: string | null = null;

    let hasLoadedFirstPosts = false;

    const fetchReplies = async (nextpage = comment.repliesPage) => {
        if (nextpage === comment.repliesPage && replies.length > 0) return;

        const v = $page.url.searchParams.get("v");
        if (!v || !nextpage) return;
        const response = await PipedApi(fetch, $page.data.instance.api_url).getComments({
            videoId: v,
            nextpage,
        });
        replies = [...replies, ...response.comments];
        nextPageReplies = response.nextpage;
        if (nextpage === comment.repliesPage) hasLoadedFirstPosts = true;
    };

    let expandReplies = false;
</script>

{#if comment.commentText}
    <div class="flex gap-2">
        <Avatar>
            <AvatarImage
                src={comment.thumbnail}
                referrerpolicy="no-referrer"
                crossorigin="anonymous"
                loading="lazy" />
            <AvatarFallback>
                {comment.author ? comment.author.slice(1, 2).toLowerCase() : "?"}
            </AvatarFallback>
        </Avatar>

        <div class="flex flex-col">
            <p class="text-sm text-muted-foreground">
                {comment.author ? comment.author : "?"}
                {#if comment.verified}
                    <Check class="inline h-4 w-4" />
                {/if}
                {"•"}
                {comment.commentedTime}
                {#if comment.pinned}
                    <Pin class="inline h-4 w-4" />
                {/if}
            </p>
            <p class="prose prose-neutral dark:prose-invert">
                {@html extractTimestamps(comment.commentText)}
            </p>
            <div class="mt-1.5">
                <p class="flex items-center gap-4 text-xs text-muted-foreground">
                    <span class="inline-flex items-center gap-2">
                        <ThumbsUp class="-mt-0.5 h-3 w-3" />{comment.likeCount}
                    </span>

                    {#if comment.hearted}
                        <span
                            class="inline-flex items-center gap-2 rounded-full bg-primary-foreground px-2 py-1">
                            <Heart class="-mt-0.5 h-3 w-3 text-red-500" /> from {channelName}
                        </span>
                    {/if}
                </p>
            </div>
            {#if comment.replyCount > 0}
                <div class="mt-2">
                    <Button
                        variant="outline"
                        size="xs"
                        on:click={() => {
                            expandReplies = !expandReplies;
                            fetchReplies(comment.repliesPage);
                        }}>
                        {expandReplies ? "Hide" : "Show"}
                        {comment.replyCount} replies
                    </Button>
                </div>

                {#if expandReplies && hasLoadedFirstPosts}
                    <div class="mt-4"></div>
                    <div class="flex flex-col gap-2" transition:slide>
                        {#each replies as reply}
                            <svelte:self comment={reply} {channelName} />
                        {/each}

                        {#if nextPageReplies}
                            <Button
                                variant="outline"
                                size="xs"
                                on:click={() => {
                                    nextPageReplies && fetchReplies(nextPageReplies);
                                }}
                                class="mt-2 w-max">
                                Load more
                            </Button>
                        {/if}
                    </div>
                {/if}
            {/if}
        </div>
    </div>
{/if}

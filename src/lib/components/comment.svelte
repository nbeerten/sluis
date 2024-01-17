<script lang="ts">
    import { page } from "$app/stores";
    import type { comments_videoId } from "$lib/api/types";
    import { Avatar, AvatarFallback, AvatarImage } from "$lib/components/ui/avatar";
    import ThumbsUp from "~icons/lucide/thumbs-up";
    import Pin from "~icons/lucide/pin";
    import Check from "~icons/lucide/check";
    import Heart from "~icons/lucide/heart";

    export let comment: comments_videoId["comments"][number];
    export let channelName: string;

    function extractTimestamps(commentText: string) {
        const timeStampRegex =
            /(<a href="https:\/\/www.youtube.com\/watch\?v=[a-zA-Z0-9_-]{11}(?:&amp;t=([0-9]+))?">([0-9:]+)<\/a>)/gi;
        const newComment = commentText.replaceAll(
            timeStampRegex,
            `<a href="/watch?v=${$page.url.searchParams.get("v")}&t=$2">$3</a>`
        );

        return newComment;
    }
</script>

<div class="flex gap-2">
    <Avatar>
        <AvatarImage src={comment.thumbnail} />
        <AvatarFallback>
            {comment.author.slice(1, 2)}
        </AvatarFallback>
    </Avatar>

    <div class="flex flex-col">
        <p class="text-sm text-muted-foreground">
            {comment.author}
            {#if comment.verified}
                <Check class="inline h-4 w-4" />
            {/if}
            {"•"}
            {comment.commentedTime}
            {#if comment.pinned}
                <Pin class="inline h-4 w-4" />
            {/if}
        </p>
        <p class="prose prose-invert">{@html extractTimestamps(comment.commentText)}</p>
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
    </div>
</div>

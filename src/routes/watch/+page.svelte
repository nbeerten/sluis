<script lang="ts">
    import { formatTimeAgo } from "$lib/format-time-ago";
    import {
        Accordion,
        AccordionContent,
        AccordionItem,
        AccordionTrigger,
    } from "$lib/components/ui/accordion";
    import { Avatar, AvatarFallback, AvatarImage } from "$lib/components/ui/avatar";
    import { Button } from "$lib/components/ui/button";
    import Check from "~icons/lucide/check";
    import "media-chrome";
    import { enhance } from "$app/forms";
    import { toast } from "svelte-sonner";
    import SEO from "$lib/components/seo";
    import { browser } from "$app/environment";
    import YouTube from "~icons/lucide/youtube";
    import Share from "~icons/lucide/share-2";
    import Plus from "~icons/lucide/plus";
    import ThumbsUp from "~icons/lucide/thumbs-up";
    import ThumbsDown from "~icons/lucide/thumbs-down";
    import * as Dialog from "$lib/components/ui/dialog";
    import { goto, beforeNavigate } from "$app/navigation";
    import { autoplay, queue, timeTillNext } from "$lib/stores";
    import { preloadData } from "$app/navigation";
    import { page } from "$app/stores";
    import formatDuration from "format-duration";
    import CommentSection from "./CommentSection.svelte";
    import RelatedStreams from "./RelatedStreams.svelte";

    const { format: formatNumber } = Intl.NumberFormat("en", { notation: "compact" });

    export let data;
    let { video, subscriptions, loggedIn } = data;
    $: video = data.video;
    $: subscriptions = data.subscriptions;
    $: loggedIn = data.loggedIn;

    let videoId = $page.url.searchParams.get("v");
    $: videoId = $page.url.searchParams.get("v");

    let subscribed: boolean;
    $: subscribed =
        subscriptions &&
        subscriptions.length > 0 &&
        subscriptions?.find((s) => s.url === video.uploaderUrl) !== undefined;

    function share() {
        if (navigator) {
            navigator.share({
                text: `'${video.title}' by ${video.uploader} - Sluis`,
                url: window.location.href,
            });
        }
    }

    let currentTime = 0;

    async function nextVideo() {
        if($queue.length > 0) {
            setTimeout(async () => {
                const url = `/watch?v=${$queue[0].id}`;
                await preloadData(url);
                $queue = $queue.slice(1);
                goto(url);
            }, $timeTillNext * 1000);
        } else if($autoplay) {
            setTimeout(async () => {
                await preloadData(video.relatedStreams[0].url);
                goto(video.relatedStreams[0].url);
            }, $timeTillNext * 1000);
        }
    }

    beforeNavigate(async () => {
        await saveToIndexedDb(video, currentTime || 0);
    });

    async function saveToIndexedDb(v: typeof video, currentTime: number) {
        if (!browser) return;

        const db = (await import("$lib/indexeddb")).db;
        if (db && videoId !== null) {
            const progressPercentage = Number(((currentTime / v.duration) * 100).toFixed(2));

            const existingVideoProgress = await db.videos.get(videoId);

            if (
                existingVideoProgress !== undefined &&
                existingVideoProgress.progress > progressPercentage
            ) {
                return;
            }

            db.videos.put({
                id: videoId,
                progress: progressPercentage,
                video: {
                    id: videoId,
                    title: v.title,
                    thumbnail: v.thumbnailUrl,
                    uploader: {
                        name: v.uploader,
                        id: v.uploaderUrl.slice(9),
                        avatar: v.uploaderAvatar,
                        verified: v.uploaderVerified,
                    },
                    duration: v.duration,
                    uploadDate: v.uploadDate,
                    views: v.views,
                },
                watchedAt: new Date(Date.now()),
            });
        }
    }
</script>

<SEO title={video.title} robots={["noindex", "nofollow"]} />

<div class="space-y-6">
    <div
        class="flex aspect-video max-h-[75vh] w-full justify-center overflow-hidden rounded-xl bg-black">
        {#await import("./VideoPlayer.svelte") then { default: VideoPlayer }}
            {#key video}
                {#await data.streamed.sponsors then sponsors}
                    <VideoPlayer {video} {sponsors} {nextVideo} bind:currentTime />
                {/await}
            {/key}
        {/await}
    </div>
    <div class="flex gap-2">
        <div class="grid w-full grid-cols-1 gap-8 xl:grid-cols-[1fr,24rem]">
            <div class="flex flex-col gap-2">
                <Accordion>
                    <AccordionItem value="item-1">
                        <AccordionTrigger
                            class="-mx-2 grid w-full grid-cols-[1fr,1rem] rounded-md px-2 py-2 pb-2 pt-0 text-start hover:bg-primary-foreground hover:no-underline">
                            <div class="flex flex-col gap-0">
                                <h1 class="text-2xl font-bold">
                                    {video.title}
                                </h1>
                                <div
                                    class="flex flex-col gap-x-6 gap-y-1 text-sm text-muted-foreground md:flex-row">
                                    <p class="block">
                                        {formatNumber(video.views)} views • Uploaded
                                        {formatTimeAgo(new Date(video.uploadDate))}
                                    </p>
                                    <div class="flex items-center gap-4">
                                        <span class="flex items-center gap-2">
                                            <ThumbsUp class="mb-0.5 h-4 w-4" />
                                            {formatNumber(video.likes)}
                                        </span>
                                        <span class="flex items-center gap-2">
                                            <ThumbsDown class="-mb-1 h-4 w-4" />
                                            {formatNumber(video.dislikes)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </AccordionTrigger>
                        <AccordionContent>
                            <p class="prose prose-neutral dark:prose-invert">
                                {@html video.description}
                            </p>

                            <div class="pt-4 text-sm text-muted-foreground">
                                <table class="table">
                                    <tbody>
                                        <tr>
                                            <td class="pr-4 font-semibold">License</td>
                                            <td>{video.license}</td>
                                        </tr>
                                        <tr>
                                            <td class="pr-4 font-semibold">Category</td>
                                            <td>{video.category}</td>
                                        </tr>
                                        <tr>
                                            <td class="pr-4 font-semibold">Visibility</td>
                                            <td>{video.visibility}</td>
                                        </tr>
                                        <tr>
                                            <td class="pr-4 font-semibold">Upload Date</td>
                                            <td>
                                                {new Date(video.uploadDate).toLocaleString()}
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>

                {#if video.chapters.length > 0}
                    <div
                        class="flex min-w-0 flex-shrink flex-wrap justify-start gap-x-1.5 gap-y-1 border-b border-border pb-2">
                        {#each video.chapters as chapter}
                            <a
                                class="flex flex-col gap-1 rounded-md border border-border px-2 py-1"
                                href="/watch?v={$page.url.searchParams.get('v')}&t={chapter.start}">
                                <p class="line-clamp-2 text-sm text-muted-foreground">
                                    <span class="mr-0.5 text-primary">
                                        {formatDuration(chapter.start * 1000)}
                                    </span>
                                    <span title={chapter.title}>{chapter.title}</span>
                                </p>
                            </a>
                        {/each}
                    </div>
                {/if}
                <div class="flex flex-col justify-between gap-3 xl:flex-row xl:items-center">
                    <div class="flex items-center justify-between gap-3 xl:justify-normal">
                        <div class="flex items-center gap-3">
                            <div>
                                <a href={video.uploaderUrl}>
                                    <Avatar>
                                        <AvatarImage src={video.uploaderAvatar} />
                                        <AvatarFallback>AV</AvatarFallback>
                                    </Avatar>
                                </a>
                            </div>
                            <div class="mr-auto flex flex-col justify-center pr-2 md:mr-0">
                                <a href={video.uploaderUrl}>
                                    <span
                                        class="inline-flex items-center gap-1 text-sm font-semibold">
                                        {video.uploader}
                                        {#if video.uploaderVerified}
                                            <Check class="mt-0.5 h-4 w-4" />
                                        {/if}
                                    </span>
                                </a>
                                <span class="text-sm text-muted-foreground">
                                    {formatNumber(video.uploaderSubscriberCount)}
                                    subscribers
                                </span>
                            </div>
                        </div>
                        {#if !subscribed && loggedIn}
                            <form
                                action="{video.uploaderUrl}?/subscribe"
                                method="POST"
                                use:enhance
                                on:submit={() => toast.success(`Subscribed to ${video.uploader}`)}>
                                <Button variant="default" type="submit">Subscribe</Button>
                            </form>
                        {:else if loggedIn}
                            <form
                                action="{video.uploaderUrl}?/unsubscribe"
                                method="POST"
                                use:enhance
                                on:submit={() =>
                                    toast.success(`Unsubscribed from ${video.uploader}`)}>
                                <Button variant="secondary" type="submit">Unsubscribe</Button>
                            </form>
                        {/if}
                    </div>
                    <div class="flex items-center justify-stretch gap-2">
                        <Button
                            variant="secondary"
                            href="https://youtube.com/watch?v={$page.url.searchParams.get('v')}"
                            class="w-max gap-2 md:w-auto">
                            <YouTube class="h-4 w-4 text-red-500" />
                            <span class="hidden md:inline">Open on YouTube</span>
                        </Button>
                        <Button variant="secondary" on:click={share} class="w-max gap-2 md:w-auto">
                            <Share class="h-4 w-4" />
                            <span class="hidden md:inline">Share</span>
                        </Button>
                        <Dialog.Root preventScroll={false}>
                            <Dialog.Trigger asChild let:builder>
                                <Button
                                    builders={[builder]}
                                    variant="secondary"
                                    class="w-full gap-2 md:w-auto">
                                    <Plus class="h-4 w-4" /> Add to playlist
                                </Button>
                            </Dialog.Trigger>
                            <Dialog.Content>
                                <Dialog.Header>
                                    <Dialog.Title>Add to playlist</Dialog.Title>
                                </Dialog.Header>
                                {#await data.streamed.playlists}
                                    <p>Loading...</p>
                                {:then playlists}
                                    {#if Array.isArray(playlists) && playlists.length > 0}
                                        <ul class="divide-y">
                                            {#each playlists as playlist}
                                                <li class="flex items-center justify-between py-2">
                                                    <p class="text-muted-foreground">
                                                        {playlist.name}
                                                    </p>
                                                    <Button size="xs" variant="secondary">
                                                        <Plus class="h-4 w-4" />
                                                    </Button>
                                                </li>
                                            {/each}
                                        </ul>
                                    {:else if loggedIn}
                                        <p class="text-sm text-muted-foreground">
                                            You don't have any playlists
                                        </p>
                                    {:else}
                                        <p class="text-sm text-muted-foreground">
                                            You must be logged in to add playlists
                                        </p>
                                    {/if}
                                {/await}
                            </Dialog.Content>
                        </Dialog.Root>
                    </div>
                </div>
                <div class="flex flex-col gap-2 py-4 xl:hidden">
                    <RelatedStreams {video} />
                </div>
                <div class="flex flex-col gap-3 pt-2">
                    {#await data.streamed.comments}
                        <h2 class="text-xl font-semibold">Comments</h2>
                        <p>Loading...</p>
                    {:then comments}
                        <CommentSection {comments} {video} {videoId} />
                    {:catch}
                        <h2 class="text-xl font-semibold">Comments</h2>
                        <p>Failed to load comments</p>
                    {/await}
                </div>
            </div>
            <div class="hidden flex-col gap-2 xl:flex">
                <RelatedStreams {video} />
            </div>
        </div>
    </div>
</div>

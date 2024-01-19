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
    import "hls-video-element";
    import { enhance } from "$app/forms";
    import { toast } from "svelte-sonner";
    import { onMount } from "svelte";
    import SEO from "$lib/components/seo";
    import { browser } from "$app/environment";
    import Share from "~icons/lucide/share-2";
    import Plus from "~icons/lucide/plus";
    import * as Dialog from "$lib/components/ui/dialog";
    import { Switch } from "$lib/components/ui/switch";
    import VideoCard from "$lib/components/video-card.svelte";
    import { goto } from "$app/navigation";
    import { autoplay, seekAmount, startMuted, timeTillNext } from "$lib/stores";
    import { Label } from "$lib/components/ui/label";
    import { preloadData } from "$app/navigation";
    import { page } from "$app/stores";
    import Comment from "$lib/components/comment.svelte";
    import type { sponsors_videoId } from "$lib/api/types.js";
    import formatDuration from "format-duration";

    const config = {
        seekAmount: $seekAmount,
    };

    const { format: formatNumber } = Intl.NumberFormat("en", { notation: "compact" });

    export let data;
    let { video, subscriptions, loggedIn } = data;
    $: video = data.video;
    $: subscriptions = data.subscriptions;
    $: loggedIn = data.loggedIn;

    $: video, resetState();

    function resetState() {
        currentTime = 0;
    }

    let subscribed: boolean;
    $: subscribed =
        subscriptions &&
        subscriptions.length > 0 &&
        subscriptions?.find((s) => s.url === video.uploaderUrl) !== undefined;

    let videoElement: HTMLVideoElement | null = null;

    function share() {
        if (navigator) {
            navigator.share({
                text: `'${video.title}' by ${video.uploader} - Sluis`,
                url: window.location.href,
            });
        }
    }

    let currentTime = 0;

    $: {
        const startAt = $page.url.searchParams.get("t");
        if (startAt !== null && videoElement) {
            if (startAt === "") {
                videoElement.currentTime = 0;
            } else {
                videoElement.currentTime = Number(startAt);
            }
            videoElement.play();
        }
    }

    /**
     * Media Session
     */

    $: {
        if (browser && videoElement) {
            navigator.mediaSession.playbackState = videoElement.paused ? "paused" : "playing";
        }
    }

    async function nextVideo() {
        if (videoElement) {
            setTimeout(async () => {
                await preloadData(video.relatedStreams[0].url);
                goto(video.relatedStreams[0].url);
            }, $timeTillNext * 1000);
        }
    }

    onMount(() => {
        if (!browser) return;

        navigator.mediaSession.metadata = new window.MediaMetadata({
            title: video.title,
            artist: video.uploader,
            artwork: [
                {
                    src: video.thumbnailUrl,
                },
            ],
        });

        if (videoElement) {
            videoElement.addEventListener("loadedmetadata", () => {
                const startAt = $page.url.searchParams.get("t");

                if (startAt && videoElement) videoElement.currentTime = Number(startAt);
            });

            videoElement.addEventListener("ended", async () => {
                if ($autoplay) {
                    await nextVideo();
                }
            });

            videoElement.addEventListener("timeupdate", () => {
                if (videoElement !== null && "currentTime" in videoElement)
                    currentTime = videoElement.currentTime || 0;
                else currentTime = 0;
            });

            for (const [action, handler] of Object.entries(playerActions)) {
                navigator.mediaSession.setActionHandler(action as MediaSessionAction, handler);
            }
        }

        return () => {
            if (videoElement) {
                videoElement.pause();
                videoElement.removeAttribute("src");
                videoElement.load();
            }
        };
    });

    const playerActions: { [key in MediaSessionAction]?: MediaSessionActionHandler } = {
        play: () => {
            if (videoElement !== null) videoElement.play();
        },
        pause: () => {
            if (videoElement !== null) videoElement.pause();
        },
        seekbackward: (event) => {
            const seekBy = event.seekOffset || $seekAmount;
            if (videoElement !== null)
                videoElement.currentTime = Math.max(0, videoElement.currentTime - seekBy);
        },
        seekforward: (event) => {
            const seekBy = event.seekOffset || $seekAmount;
            if (videoElement !== null)
                videoElement.currentTime = Math.min(
                    videoElement.duration,
                    videoElement.currentTime + seekBy
                );
        },
        seekto: (event) => {
            if (event.seekTime && videoElement !== null) {
                videoElement.currentTime = event.seekTime;
            }
        },
        nexttrack: () => {
            if (videoElement !== null) {
                nextVideo();
            }
        },
    };

    /**
     * Sponsors
     */

    let sponsorsData: sponsors_videoId | false = false;

    data.streamed.sponsors.then((data) => {
        sponsorsData = data;
    });

    $: if (browser && videoElement) {
        const inSegment = isInSponsorSegment(sponsorsData, currentTime);
        if (inSegment !== false) {
            videoElement.currentTime = inSegment;
        }
    }

    function isInSponsorSegment(
        sponsors: sponsors_videoId | false,
        currentTime: number
    ): number | false {
        if (!sponsors) return false;
        if (!sponsors.segments || !sponsors.segments.length) return false;

        for (const segment of sponsors.segments) {
            const [start, end] = segment.segment;
            if (currentTime >= start && currentTime <= end) {
                return end;
            }
        }
        return false;
    }

    const segmentColors = {
        sponsor: "#00D400",
        intro: "#00FFFF",
        outro: "#0202ED",
        preview: "#008FD6",
        interaction: "#CC00FF",
        selfpromo: "#FFFF00",
        music_offtopic: "#FF9900",
        filler: "#7300FF",
    };

    function generateLinearGradient(sponsors: sponsors_videoId | false) {
        if (!sponsors) return false;
        if (!sponsors.segments || !sponsors.segments.length) return false;

        const segmentArray = sponsors.segments.map((segment) => {
            const [start, end] = segment.segment;
            return { start, end, category: segment.category };
        });

        const duration = sponsors.segments[0].videoDuration;

        const defaultBg = "#ffffff33";

        let gradient = `${defaultBg} 0%`;

        for (const segment of segmentArray) {
            const segmentColor = segmentColors[segment.category];
            const { start, end } = segment;
            const startPercentage = ((start / duration) * 100).toFixed(2);
            gradient += `, ${defaultBg} ${startPercentage}%, ${segmentColor} ${startPercentage}%`;
            const endPercentage = ((end / duration) * 100).toFixed(2);
            gradient += `, ${segmentColor} ${endPercentage}%, ${defaultBg} ${endPercentage}%`;
        }
        gradient += `, ${defaultBg} 100%`;

        return `linear-gradient(to right, ${gradient})`;
    }
</script>

<SEO title={video.title} robots={["noindex", "nofollow"]} />

<div class="space-y-6">
    <div
        class="flex aspect-video max-h-[75vh] w-full justify-center overflow-hidden rounded-xl bg-black">
        {#if video.hls}
            <media-controller style="width: 100%;">
                <hls-video
                    src={video.hls}
                    slot="media"
                    muted={$startMuted}
                    crossorigin
                    autoplay
                    bind:this={videoElement}>
                </hls-video>
                <media-poster-image slot="poster" src={video.thumbnailUrl}></media-poster-image>

                <media-control-bar class="media-control-bar p-0">
                    {#await data.streamed.sponsors}
                        <media-time-range class="h-1.5 pb-2 pt-0.5"></media-time-range>
                    {:then awaitedSponsors}
                        <media-time-range
                            class="h-1.5 pb-2 pt-0.5"
                            style="--media-range-track-background: {generateLinearGradient(
                                awaitedSponsors
                            ) || 'initial'}">
                        </media-time-range>
                    {/await}
                </media-control-bar>

                <media-control-bar class="media-control-bar">
                    <media-play-button></media-play-button>
                    <media-seek-backward-button seekoffset={$seekAmount} class="hidden md:block">
                    </media-seek-backward-button>
                    <media-seek-forward-button seekoffset={$seekAmount} class="hidden md:block">
                    </media-seek-forward-button>
                    <media-mute-button></media-mute-button>
                    <media-time-display showduration class="tabular-nums"></media-time-display>
                    <span
                        class="flex flex-grow flex-col justify-center bg-[var(--media-control-background)] text-center">
                    </span>
                    <media-pip-button></media-pip-button>
                    <media-fullscreen-button></media-fullscreen-button>
                </media-control-bar>
            </media-controller>
        {:else}
            <div class="grid place-content-center">
                <div class="flex max-w-lg flex-col rounded-lg bg-background px-6 py-4">
                    <p class="text-lg font-semibold">
                        Sorry, but our player cannot play this video yet.
                    </p>
                    <p class="min-w-0 text-muted-foreground">
                        This video is most likely a livestream or a premiere, which means that there
                        isn't a HLS source available.
                    </p>
                    <div class="flex gap-2 pt-3">
                        <Button
                            class="w-full"
                            target="_blank"
                            variant="secondary"
                            href="https://piped.video/watch?v={$page.url.searchParams.get('v')}">
                            Watch on piped.video
                        </Button>
                        <Button
                            class="w-full"
                            target="_blank"
                            variant="outline"
                            href="https://youtube.com/watch?v={$page.url.searchParams.get('v')}">
                            Watch on YouTube
                        </Button>
                    </div>
                </div>
            </div>
        {/if}
    </div>
    <div class="flex gap-2">
        <div class="grid w-full grid-cols-1 gap-8 xl:grid-cols-[1fr,24rem]">
            <div class="flex flex-col gap-2">
                <Accordion>
                    <AccordionItem value="item-1">
                        <AccordionTrigger
                            class="grid w-full grid-cols-[1fr,1rem] pb-2 pt-0 text-start">
                            <div class="flex flex-col gap-0">
                                <h1 class="text-2xl font-bold">
                                    {video.title}
                                </h1>
                                <p class="block text-sm text-muted-foreground">
                                    {formatNumber(video.views)} views • Uploaded
                                    {formatTimeAgo(new Date(video.uploadDate))}
                                </p>
                            </div>
                        </AccordionTrigger>
                        <AccordionContent>
                            <p class="prose dark:prose-invert">
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
                            on:click={share}
                            class="md:md-auto w-full gap-2">
                            <Share class="h-4 w-4" />
                            <span class="hidden md:inline">Share</span>
                        </Button>
                        <Dialog.Root preventScroll={false}>
                            <Dialog.Trigger asChild let:builder>
                                <Button
                                    builders={[builder]}
                                    variant="secondary"
                                    class="md:md-auto w-full gap-2">
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
                <div class="flex flex-col gap-3 pt-2">
                    <h2 class="text-xl font-semibold">Comments</h2>
                    <div class="flex flex-col gap-4">
                        {#await data.streamed.comments}
                            <p>Loading...</p>
                        {:then comments}
                            {#each comments.comments as comment}
                                <Comment {comment} channelName={video.uploader} />
                            {/each}
                        {/await}
                    </div>
                </div>
            </div>
            <div class="flex flex-col gap-2">
                <div class="flex flex-col gap-2">
                    <div class="flex items-center justify-between gap-2">
                        <p class="text-lg font-semibold">Next video</p>
                        <div class="flex items-center gap-2 font-semibold">
                            <Label for="autoplay" class="text-sm text-muted-foreground">
                                Autoplay
                            </Label>
                            <Switch bind:checked={$autoplay} id="autoplay" class="scale-90" />
                        </div>
                    </div>
                    {#if video.relatedStreams[0] && video.relatedStreams[0].title && video.relatedStreams[0].uploaderUrl && video.relatedStreams[0].url}
                        <VideoCard
                            video={{
                                ...video.relatedStreams[0],
                                id: video.relatedStreams[0].url.slice(9),
                                uploader: {
                                    name: video.relatedStreams[0].uploaderName,
                                    id: video.relatedStreams[0].uploaderUrl.slice(9),
                                    avatar: video.relatedStreams[0].uploaderAvatar,
                                    verified: video.relatedStreams[0].uploaderVerified,
                                },
                                uploadDate: video.relatedStreams[0].uploaded,
                            }}
                            lazyImage={false}
                            bareCard
                            horizontalCard />
                    {/if}
                </div>
                <Accordion>
                    <AccordionItem value="item-1">
                        <AccordionTrigger>Related videos</AccordionTrigger>
                        <AccordionContent>
                            <div class="flex flex-col gap-2">
                                {#each video.relatedStreams.slice(1) as relatedStream}
                                    {#if relatedStream && relatedStream.title && relatedStream.uploaderUrl && relatedStream.url}
                                        <VideoCard
                                            video={{
                                                ...relatedStream,
                                                id: relatedStream.url.slice(9),
                                                uploader: {
                                                    name: relatedStream.uploaderName,
                                                    id: relatedStream.uploaderUrl.slice(9),
                                                    avatar: relatedStream.uploaderAvatar,
                                                    verified: relatedStream.uploaderVerified,
                                                },
                                                uploadDate: relatedStream.uploaded,
                                            }}
                                            bareCard
                                            horizontalCard />
                                    {/if}
                                {/each}
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </div>
        </div>
    </div>
</div>

<style lang="postcss">
    .media-control-bar {
        --media-secondary-color: theme(colors.primary.foreground);
        --media-primary-color: theme(colors.foreground);
        --media-text-color: theme(colors.foreground);

        --media-control-background: theme(colors.primary.foreground / 0.75);
        --media-control-hover-background: theme(colors.primary.foreground / 0.75);
        --media-font-family: theme(fontFamily.sans);
    }

    .media-control-bar > :first-child {
        padding-left: 0.75rem;
    }

    .media-control-bar > :last-child {
        padding-right: 0.75rem;
    }
</style>

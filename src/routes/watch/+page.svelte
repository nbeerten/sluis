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
    import { onDestroy, onMount } from "svelte";
    import SEO from "$lib/components/seo";
    import { browser } from "$app/environment";
    import Share from "~icons/lucide/share-2";
    import Plus from "~icons/lucide/plus";
    import * as Dialog from "$lib/components/ui/dialog";

    const config = {
        seekAmount: 10,
    }

    const { format: formatNumber } = Intl.NumberFormat("en", { notation: "compact" });

    export let data;
    const video = data.video;
    let { subscriptions, loggedIn, playlists } = data;
    $: subscriptions = data.subscriptions;
    $: playlists = data.playlists;
    $: loggedIn = data.loggedIn;

    let subscribed: boolean;
    $: subscribed =
        subscriptions && subscriptions?.find((s) => s.url === video.uploaderUrl) !== undefined;

    let videoElement: HTMLVideoElement;

    onDestroy(() => {
        if (videoElement && browser) {
            videoElement.pause();
            videoElement.removeAttribute("src");
            videoElement.load();
        }
    });

    function share() {
        if (navigator) {
            navigator.share({
                text: `'${video.title}' by ${video.uploader} - Sluis`,
                url: window.location.href,
            });
        }
    }

    $: { 
        if (browser && videoElement) {
            navigator.mediaSession.playbackState = videoElement.paused ? "paused" : "playing";
        }
    }

    let currentTime = 0;

    // $: if(browser && videoElement) {
    //     if(currentTime >= 5 && currentTime <= 10) {
    //         videoElement.currentTime = currentTime + 5;
    //     }
    // }

    onMount(() => {
        if (!browser) return;

        navigator.mediaSession.metadata = new window.MediaMetadata({
            title: video.title,
            artist: video.uploader,
            artwork: [
                {
                    src: video.thumbnailUrl
                }
            ],
        });

        if(videoElement) {
            videoElement.addEventListener("timeupdate", () => {
                currentTime = videoElement.currentTime || 0;
            });

            navigator.mediaSession.setActionHandler("play", () => {
                videoElement.play();
            });
            navigator.mediaSession.setActionHandler("pause", () => {
                videoElement.pause();
            });
            navigator.mediaSession.setActionHandler("seekbackward", (event) => {
                const seekAmount = event.seekOffset || config.seekAmount;
                videoElement.currentTime = Math.max(0, videoElement.currentTime - seekAmount);
            });
            navigator.mediaSession.setActionHandler("seekforward", (event) => {
                const seekAmount = event.seekOffset || config.seekAmount;
                videoElement.currentTime = Math.min(videoElement.duration, videoElement.currentTime + seekAmount);
            });
            navigator.mediaSession.setActionHandler("seekto", (event) => {
                if(event.seekTime) {
                    videoElement.currentTime = event.seekTime;
                }
            });
        }
    });
</script>

<SEO title={video.title} />

<div class="space-y-6">
    <div
        class="flex aspect-video max-h-[75vh] w-full justify-center overflow-hidden rounded-xl bg-black">
        <media-controller style="width: 100%;">
            <hls-video src={video.hls} slot="media" crossorigin autoplay bind:this={videoElement}>
            </hls-video>
            <media-poster-image
                slot="poster"
                src={video.thumbnailUrl}>
            </media-poster-image>
            <media-control-bar>
                <media-play-button></media-play-button>
                <media-seek-backward-button seekoffset="{config.seekAmount}" class="hidden md:block"></media-seek-backward-button>
                <media-seek-forward-button seekoffset="{config.seekAmount}" class="hidden md:block"></media-seek-forward-button>
                <media-mute-button></media-mute-button>
                <media-volume-range class="hidden md:block"></media-volume-range>
                <media-time-display showduration></media-time-display>
                <media-time-range></media-time-range>
                <media-pip-button></media-pip-button>
                <media-fullscreen-button></media-fullscreen-button>
            </media-control-bar>
        </media-controller>
    </div>
    <div class="flex gap-2">
        <div class="w-full">
            <div class="space-y-2">
                <Accordion>
                    <AccordionItem value="item-1">
                        <AccordionTrigger class="w-full pb-2 pt-0 text-start">
                            <div class="flex flex-col gap-0">
                                <h1 class="block text-2xl font-bold">
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
                <div class="flex flex-col md:flex-row md:items-center justify-between gap-3">
                    <div class="flex items-center gap-3">
                        <div>
                            <a href={video.uploaderUrl}>
                                <Avatar>
                                    <AvatarImage src={video.uploaderAvatar} />
                                    <AvatarFallback>AV</AvatarFallback>
                                </Avatar>
                            </a>
                        </div>
                        <div class="flex flex-col justify-center pr-2 mr-auto md:mr-0">
                            <a href={video.uploaderUrl}>
                                <span class="inline-flex items-center gap-1 text-sm font-semibold">
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
                    <div class="flex gap-2 items-center justify-stretch">
                        <Button variant="secondary" on:click={share} class="gap-2 w-full md:md-auto">
                            <Share class="h-4 w-4" /> Share
                        </Button>
                        <Dialog.Root preventScroll={false}>
                            <Dialog.Trigger asChild let:builder>
                                <Button builders={[builder]} variant="secondary" class="gap-2 w-full md:md-auto">
                                    <Plus class="h-4 w-4" /> Add to playlist
                                </Button>
                            </Dialog.Trigger>
                            <Dialog.Content>
                                <Dialog.Header>
                                    <Dialog.Title>Add to playlist</Dialog.Title>
                                </Dialog.Header>
                                {#if playlists.length > 0}
                                    <ul class="divide-y">
                                        {#each playlists as playlist}
                                            <li class="flex items-center justify-between py-2">
                                                <p class="text-muted-foreground">{playlist.name}</p>
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
                            </Dialog.Content>
                        </Dialog.Root>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<script lang="ts">
    import { page } from "$app/stores";
    import type { streams_videoId_base, sponsors_videoId } from "$lib/api/types";
    import type ShakaVideoElement from "$lib/shaka-video";
    import { onMount } from "svelte";
    import { generate_dash_file_from_formats } from "./DashUtils";
    import { seekAmount, startMuted, subtitles } from "$lib/stores";
    import Subtitles from "~icons/lucide/subtitles";
    import "$lib/shaka-video";
    import "hls-video-element";

    export let video: streams_videoId_base;
    export let sponsors: sponsors_videoId | false;

    export let nextVideo: (() => void) | (() => Promise<void>) | undefined = undefined;

    let videoElement: ShakaVideoElement | null = null;

    let destroy = false;

    function getSource(video: streams_videoId_base) {
        if (video.livestream && video.hls)
            return {
                type: "hls",
                source: video.hls,
            };

        if (video.dash)
            return {
                type: "dash",
                source: video.dash,
            };

        return {
            type: "dash",
            source:
                "data:application/dash+xml;charset=utf-8;base64," +
                btoa(
                    generate_dash_file_from_formats(
                        [...video.audioStreams, ...video.videoStreams],
                        video.duration
                    )
                ),
        };
    }

    let videoSource = getSource(video);

    export let currentTime = 0;

    $: {
        const startAt = $page.url.searchParams.get("t");
        if (startAt) {
            skipTo(Number(startAt));
        }
    }

    function skipTo(seconds: number | undefined) {
        if (videoElement && typeof seconds === "number") {
            videoElement.currentTime = seconds;
        }
    }

    onMount(() => {
        destroy = false;

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
            videoElement.addEventListener("loadeddata", () => {
                const startAt = $page.url.searchParams.get("t");
                if (startAt && videoElement) {
                    skipTo(Number(startAt));
                }

                if ($subtitles) {
                    if (videoElement) videoElement.player?.setTextTrackVisibility(true);
                }
            });

            videoElement.addEventListener("ended", async () => {
                await nextVideo?.();
            });

            videoElement.addEventListener("timeupdate", async () => {
                if (videoElement !== null && "currentTime" in videoElement) {
                    currentTime = videoElement.currentTime || 0;
                    navigator.mediaSession.setPositionState({ duration: video.duration, position: currentTime });
                } else currentTime = 0;
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
                videoElement.player?.destroy();
            }

            currentTime = 0;
            navigator.mediaSession.metadata = null;
            navigator.mediaSession.playbackState = "none";
            navigator.mediaSession.setPositionState({ duration: 0, position: 0 });

            destroy = true;  
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
                nextVideo?.();
            }
        },
    };

    function toggleSubtitlesVisibility() {
        if (videoElement) {
            const currentVisibility = videoElement.player?.isTextTrackVisible();
            videoElement.player?.setTextTrackVisibility(true);

            $subtitles = !currentVisibility;
            // eslint-disable-next-line no-console
        } else console.error("Failed to toggle subtitles");
    }

    let inSegment: number | false = false;
    $: inSegment = isInSponsorSegment(sponsors, currentTime);
    $: if (inSegment !== false && videoElement) {
        videoElement.currentTime = inSegment;
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

    function currentChapter(chapters: (typeof video)["chapters"], currentTime: number) {
        if (!chapters || !chapters.length) return;

        return chapters.find((chapter, i) => {
            return (
                chapter.start <= currentTime &&
                (i === chapters.length - 1 || chapters[i + 1].start > currentTime)
            );
        });
    }
</script>

{#if !destroy}
    {#key video}
        <media-controller style="width: 100%;">
            {#if videoSource.type === "dash"}
                <shaka-video
                    src={videoSource.source}
                    slot="media"
                    muted={$startMuted}
                    crossorigin
                    autoplay
                    subtitles={JSON.stringify(video.subtitles)}
                    bind:this={videoElement}>
                </shaka-video>
            {:else if videoSource.type === "hls"}
                <hls-video
                    src={videoSource.source}
                    slot="media"
                    muted={$startMuted}
                    crossorigin
                    autoplay
                    bind:this={videoElement}>
                </hls-video>
            {/if}
            <media-poster-image slot="poster" src={video.thumbnailUrl}></media-poster-image>

            <media-control-bar class="media-control-bar p-0">
                <media-time-range
                    class="h-1.5 pb-2 pt-0.5"
                    style="--media-range-track-background: {generateLinearGradient(
                        sponsors
                    ) || 'initial'}">
                </media-time-range>
            </media-control-bar>

            <media-control-bar class="media-control-bar">
                <media-play-button></media-play-button>
                <media-seek-backward-button seekoffset={$seekAmount} class="hidden md:block">
                </media-seek-backward-button>
                <media-seek-forward-button seekoffset={$seekAmount} class="hidden md:block">
                </media-seek-forward-button>
                <media-mute-button></media-mute-button>
                <media-time-display showduration class="tabular-nums"></media-time-display>
                {#if video.chapters.length > 0}
                    <span class="mb-0.5 flex items-center bg-[var(--media-control-background)]">
                        {"•"}
                    </span>
                    <span class="flex items-center bg-[var(--media-control-background)] px-4">
                        {currentChapter(video.chapters, currentTime)?.title}
                    </span>
                {/if}
                <span
                    class="flex flex-grow flex-col justify-center bg-[var(--media-control-background)] text-center">
                </span>
                <!-- svelte-ignore a11y-click-events-have-key-events -->
                <media-captions-button
                    on:click={() => toggleSubtitlesVisibility()}
                    role="button"
                    tabindex="0">
                    <div slot="icon">
                        {#if $subtitles}
                            <Subtitles class="h-6 w-6" />
                        {:else}
                            <Subtitles class="h-6 w-6" />
                        {/if}
                    </div>
                </media-captions-button>
                <media-pip-button></media-pip-button>
                <media-fullscreen-button></media-fullscreen-button>
            </media-control-bar>
        </media-controller>
    {/key}
{/if}

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
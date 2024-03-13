<script lang="ts">
    import type { streams_videoId } from "$lib/api/types";
    import { autoplay } from "$lib/stores";
    import VideoCard from "$lib/components/video-card.svelte";
    import { Label } from "$lib/components/ui/label";
    import { Switch } from "$lib/components/ui/switch";
    import {
        Accordion,
        AccordionContent,
        AccordionItem,
        AccordionTrigger,
    } from "$lib/components/ui/accordion";
    import { queue } from "$lib/stores";

    export let video: streams_videoId;
</script>

{#if "message" in video === false}
    <!-- <div class="flex flex-col gap-2">
        <div class="flex items-center justify-between gap-2">
            <p class="text-lg font-semibold">Next video</p>
            <div class="flex items-center gap-2 font-semibold">
                <Label for="autoplay" class="text-sm text-muted-foreground">Autoplay</Label>
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
    </div> -->
    <div class="flex flex-col gap-2 rounded-md bg-primary-foreground px-3 py-2">
        <p class="text-lg font-semibold">Queue ({$queue.length})</p>
        <div class="flex flex-col gap-2">
            {#if $queue.length > 0}
                {#each $queue as queueVideo}
                    <VideoCard video={queueVideo} horizontalCard bareCard />
                {/each}
            {:else}
                <p class="text-sm text-muted-foreground">No videos in queue</p>

                <hr />

                <div class="flex items-center justify-between gap-2">
                    <p class="text-lg font-semibold">Next video</p>
                    <div class="flex items-center gap-2 font-semibold">
                        <Label for="autoplay" class="text-sm text-muted-foreground">Autoplay</Label>
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
            {/if}
        </div>
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
{/if}

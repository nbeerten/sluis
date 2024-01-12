<script lang="ts">
    import { formatTimeAgo } from '$lib/format-time-ago';
    import {
        Accordion,
        AccordionContent,
        AccordionItem,
        AccordionTrigger
    } from '$lib/components/ui/accordion';
    import { Avatar, AvatarFallback, AvatarImage } from '$lib/components/ui/avatar';
    import { Button } from '$lib/components/ui/button';
    import Check from '~icons/lucide/check';
    import 'media-chrome';
    import 'hls-video-element';

    const { format: formatNumber } = Intl.NumberFormat('en', { notation: 'compact' });

    export let data;
    const video = data.video;
</script>

<div class="space-y-6">
    <div
        class="flex aspect-video max-h-[75vh] w-full justify-center overflow-hidden rounded-xl bg-black"
    >
        <media-controller style="width: 100%;">
            <hls-video src={video.hls} slot="media" crossorigin autoplay></hls-video>
            <media-control-bar>
                <media-play-button></media-play-button>
                <media-seek-backward-button seekoffset="10"></media-seek-backward-button>
                <media-seek-forward-button seekoffset="10"></media-seek-forward-button>
                <media-mute-button></media-mute-button>
                <media-volume-range></media-volume-range>
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
                                            <td class="pr-4 font-semibold"> License </td>
                                            <td>{video.license}</td>
                                        </tr>
                                        <tr>
                                            <td class="pr-4 font-semibold"> Category </td>
                                            <td>{video.category}</td>
                                        </tr>
                                        <tr>
                                            <td class="pr-4 font-semibold"> Visibility </td>
                                            <td>{video.visibility}</td>
                                        </tr>
                                        <tr>
                                            <td class="pr-4 font-semibold"> Upload Date </td>
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
                <div class="flex items-center justify-between gap-3">
                    <div class="flex items-center gap-3">
                        <div>
                            <a href={video.uploaderUrl}>
                                <Avatar>
                                    <AvatarImage src={video.uploaderAvatar} />
                                    <AvatarFallback>AV</AvatarFallback>
                                </Avatar>
                            </a>
                        </div>
                        <div class="flex flex-col justify-center">
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
                    </div>
                    <Button variant="secondary">Subscribe</Button>
                </div>
            </div>
        </div>
    </div>
</div>

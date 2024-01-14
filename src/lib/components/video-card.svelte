<script lang="ts">
    import { Avatar, AvatarFallback, AvatarImage } from "$lib/components/ui/avatar";
    import { Card, CardDescription, CardHeader, CardTitle } from "$lib/components/ui/card";
    import { formatTimeAgo } from "$lib/format-time-ago";
    import { default as durationFormatter } from "format-duration";
    import Check from "~icons/lucide/check";
    import { cn } from "$lib/utils";

    export let video: {
        id: string;
        title: string;
        thumbnail: string;
        uploader: {
            name: string;
            id: string;
            avatar: string;
            verified: boolean;
        };
        duration: number;
        uploadDate: Date | string | number;
        views: number;
    };

    export let isShort = false;
    export let showChannel = true;

    const { format: formatNumber } = Intl.NumberFormat("en", { notation: "compact" });
</script>

<Card>
    <a href="/watch?v={video.id}" data-sveltekit-preload-data="tap">
        <div
            class={cn(
                "relative flex justify-center px-6 pt-6",
                isShort ? "aspect-square" : "aspect-video"
            )}>
            <img
                src={video.thumbnail}
                alt="Card"
                class="w-full overflow-hidden rounded-lg object-contain"
                loading="lazy" />
            {#if !isShort}
                <div
                    class="absolute bottom-0.5 left-[calc(100%-1.65rem)] -translate-x-full rounded-lg bg-background px-1 text-sm">
                    {durationFormatter(video.duration * 1000)}
                </div>
            {/if}
        </div>
    </a>

    <CardHeader>
        <div class="flex gap-2">
            {#if showChannel}
                <div class="flex items-start justify-center py-1">
                    <a href="/channel/{video.uploader.id}" data-sveltekit-preload-data="tap">
                        <Avatar>
                            <AvatarImage loading="lazy" src={video.uploader.avatar ?? undefined} />
                            <AvatarFallback>
                                {video.uploader.name.slice(0, 1)}
                            </AvatarFallback>
                        </Avatar>
                    </a>
                </div>
            {/if}
            <div>
                <CardTitle class="line-clamp-2 text-base" title={video.title}>
                    <a href="/watch?v={video.id}" data-sveltekit-preload-data="tap">
                        {video.title}
                    </a>
                </CardTitle>
                <CardDescription>
                    {#if showChannel}
                        <a href="/channel/{video.uploader.id}" data-sveltekit-preload-data="tap">
                            <span title={video.uploader.name} class="flex items-center gap-1">
                                <span class="line-clamp-1">
                                    {video.uploader.name}
                                </span>
                                {#if video.uploader.verified}
                                    <Check class="ml-0.5 inline-block h-4 w-4" />
                                {/if}
                            </span>
                        </a>
                    {/if}
                    <span class="flex items-center gap-1">
                        {formatNumber(video.views)} views
                        {#if !isShort}
                            • {formatTimeAgo(new Date(video.uploadDate))}
                        {/if}
                    </span>
                </CardDescription>
            </div>
        </div>
    </CardHeader>
</Card>

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
    export let bareCard = false;
    export let horizontalCard = false;
    export let lazyImage = true;

    let className = "";
    export { className as class };

    const { format: formatNumber } = Intl.NumberFormat("en", { notation: "compact" });
</script>

<Card
    class={cn(
        className,
        bareCard && "border-none mb-4",
        horizontalCard && "grid w-[28rem] max-w-full grid-cols-[11rem,1fr]"
    )}>
    <a href="/watch?v={video.id}" data-sveltekit-preload-data="tap">
        <div
            class={cn(
                "relative flex justify-center",
                bareCard ? "" : "mx-6 mt-6",
                horizontalCard ? "pr-3" : "",
                isShort ? "aspect-[9/16]" : "aspect-video"
            )}>
            <img
                src={video.thumbnail}
                alt="Thumbnail of {video.title}"
                crossorigin="anonymous"
                height={isShort ? 480 : 188}
                width={isShort ? 270 : 336}
                class="w-full rounded-lg object-cover"
                loading={lazyImage ? "lazy" : "eager"} />
            {#if !isShort}
                <div
                    class={cn("absolute bottom-0.5 right-1 rounded-lg bg-background px-1 text-sm", (horizontalCard) && "right-4")}>
                    {durationFormatter(video.duration * 1000)}
                </div>
            {/if}
        </div>
    </a>

    <CardHeader
        class={cn(
            bareCard && "p-0 pt-3",
            horizontalCard && "pl-0 text-sm",
            horizontalCard && bareCard && "py-0"
        )}>
        <div class="flex gap-2">
            {#if showChannel && !horizontalCard}
                <div class="flex items-start justify-center py-1">
                    <a href="/channel/{video.uploader.id}" data-sveltekit-preload-data="tap">
                        <Avatar>
                            <AvatarImage
                                loading="lazy"
                                alt="Avatar of {video.uploader.name}"
                                src={video.uploader.avatar ?? undefined} />
                            <AvatarFallback>
                                {video.uploader.name.slice(0, 1)}
                            </AvatarFallback>
                        </Avatar>
                    </a>
                </div>
            {/if}
            <div>
                <CardTitle
                    class={cn("line-clamp-2 text-base", horizontalCard && "text-sm font-semibold")}
                    title={video.title}>
                    <a href="/watch?v={video.id}" data-sveltekit-preload-data="tap">
                        {video.title}
                    </a>
                </CardTitle>
                <CardDescription class={cn(horizontalCard && "mt-0.5 text-xs leading-normal")}>
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

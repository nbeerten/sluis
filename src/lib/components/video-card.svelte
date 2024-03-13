<script lang="ts">
    import { Avatar, AvatarFallback, AvatarImage } from "$lib/components/ui/avatar";
    import { Button } from "$lib/components/ui/button";
    import {
        DropdownMenu,
        DropdownMenuContent,
        DropdownMenuTrigger,
        DropdownMenuGroup,
        DropdownMenuItem,
        DropdownMenuSeparator,
    } from "$lib/components/ui/dropdown-menu";
    import { Card, CardDescription, CardHeader, CardTitle } from "$lib/components/ui/card";
    import { formatTimeAgo } from "$lib/format-time-ago";
    import { default as durationFormatter } from "format-duration";
    import Check from "~icons/lucide/check";
    import EllipsisVertical from "~icons/lucide/ellipsis-vertical";
    import ListStart from "~icons/lucide/list-start";
    import ListEnd from "~icons/lucide/list-end";
    import ListX from "~icons/lucide/list-x";
    import { cn } from "$lib/utils";
    import { onMount } from "svelte";
    import { queue } from "$lib/stores";
    import { toast } from "svelte-sonner";

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
    export let bareCard = true;
    export let horizontalCard = false;
    export let lazyImage = true;

    let className = "";
    export { className as class };

    const { format: formatNumber } = Intl.NumberFormat("en", { notation: "compact" });

    let progress: number | false = false;

    onMount(async () => {
        const db = await import("$lib/indexeddb").then((i) => i.db);

        if (db) {
            db.videos.get(video.id).then((data) => {
                if (data) {
                    progress = Number(data.progress.toFixed(2));
                }
            });
        }
    });

    const toSec = (progress: number | false) =>
        progress ? Math.round((progress / 100) * video.duration) : false;

    let videoUrl = (id: string, t?: number | false) => `/watch?v=${id}${t ? `&t=${t}` : ""}`;

    const addToQueue = () => {
        if (inQueue) {
            toast.error("Already in queue");
            return;
        }

        $queue = [...$queue, video];
        toast.success("Added to queue");
    };

    const playNext = () => {
        if (inQueue) {
            toast.info("Already in queue, moved to front");
            $queue = [video, ...$queue.filter((q) => q.id !== video.id)];
            return;
        }

        toast.success("Added to the beginning of the queue");
        $queue = [video, ...$queue];
    };

    const removeFromQueue = () => {
        toast.success("Removed from queue");
        $queue = $queue.filter((q) => q.id !== video.id);
    };

    $: inQueue = $queue.some((q) => q.id === video.id);
</script>

<Card
    class={cn(
        bareCard && "mb-4 border-none bg-inherit",
        horizontalCard && "grid w-[28rem] max-w-full grid-cols-[11rem,1fr]",
        className
    )}>
    <a href={videoUrl(video.id, toSec(progress))} data-sveltekit-preload-data="tap">
        <div
            class={cn(
                "relative flex justify-center overflow-clip rounded-lg",
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
                    class={cn(
                        "absolute bottom-0.5 right-1 rounded-lg bg-background px-1 text-sm",
                        horizontalCard && "right-4",
                        progress && "bottom-2.5"
                    )}>
                    {durationFormatter(video.duration * 1000)}
                </div>
            {/if}
            {#if progress}
                <div
                    class="absolute bottom-0 left-0 right-0 h-1.5 bg-primary-foreground/30"
                    style="background-image: linear-gradient(to right, rgb(220 38 38) 0%, rgb(220 38 38) {progress}%, transparent {progress}%);">
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
            <div class="flex-grow">
                <CardTitle
                    class={cn("line-clamp-2 text-base", horizontalCard && "text-sm font-semibold")}
                    title={video.title}>
                    <a href={videoUrl(video.id, toSec(progress))} data-sveltekit-preload-data="tap">
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
            <div class="flex items-start">
                <DropdownMenu preventScroll={false}>
                    <DropdownMenuTrigger asChild let:builder>
                        <Button
                            builders={[builder]}
                            variant="ghost"
                            class="-mr-2 h-8 w-8 rounded-full p-0">
                            <EllipsisVertical class="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent side="bottom" align="end" class="min-w-[15ch]">
                        <DropdownMenuGroup>
                            <DropdownMenuItem
                                class="flex items-center gap-2"
                                on:click={() => playNext()}>
                                <ListStart class="h-5 w-5" />
                                <span>Play next</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                class="flex items-center gap-2"
                                on:click={() => addToQueue()}>
                                <ListEnd class="h-5 w-5" />
                                <span>Add to queue</span>
                            </DropdownMenuItem>
                            {#if inQueue}
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                    class="flex items-center gap-2"
                                    on:click={() => removeFromQueue()}>
                                    <ListX class="h-5 w-5" />
                                    <span>Remove from queue</span>
                                </DropdownMenuItem>
                            {/if}
                        </DropdownMenuGroup>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
    </CardHeader>
</Card>

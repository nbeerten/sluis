<script lang="ts">
    import { queue } from "$lib/stores";
    import { Button } from "$lib/components/ui/button/";
    import ChevronUp from "~icons/lucide/chevron-up";
    import VideoCard from "$lib/components/video-card.svelte";
    import { slide } from "svelte/transition";
    import { cn } from "$lib/utils";
    import { onNavigate } from "$app/navigation";
    import { page } from "$app/stores";
    import { ScrollArea } from "$lib/components/ui/scroll-area";
    import formatDuration from "format-duration";

    let expanded = false;

    onNavigate(() => {
        expanded = false;
    });

    let visible = false;

    $: visible = !$page.url.pathname.startsWith("/watch");

    let enoughVideos = false;

    $: if ($queue.length <= 0) {
        setTimeout(() => (enoughVideos = false), 1000 * 5);
    } else {
        enoughVideos = true;
    }
</script>

{#if visible && enoughVideos}
    <div
        class="fixed bottom-0 z-10 flex w-[calc(100%-2rem)] max-w-full flex-col rounded-t-md border-x border-t bg-primary-foreground drop-shadow-lg md:right-10 md:w-[30rem]"
        transition:slide>
        <Button
            variant="ghost"
            class={cn(
                "flex h-auto justify-between gap-2 rounded-b-none rounded-t-md px-3 py-2 text-start"
            )}
            on:click={() => (expanded = !expanded)}>
            <div>
                <p class="text-base font-semibold">Queue</p>
                <p class="text-sm text-muted-foreground">
                    {$queue.length} videos
                    {"•"}
                    Total: {formatDuration($queue.reduce((a, b) => a + b.duration, 0) * 1000)}
                </p>
            </div>
            <div class="flex">
                <ChevronUp
                    class={cn(
                        "h-6 w-6 rotate-0 transition-all duration-300",
                        expanded && "rotate-180"
                    )} />
            </div>
        </Button>
        {#if expanded}
            <div transition:slide>
                <div class="flex h-[20rem] flex-col gap-2 px-3 pt-2">
                    <ScrollArea class="h-[20rem] overscroll-contain pr-3">
                        {#if $queue.length === 0}
                            <p class="text-sm text-muted-foreground">No videos in queue</p>
                        {/if}
                        <div class="flex flex-col gap-2">
                            {#each $queue as video}
                                <VideoCard class="w-[calc(30rem-3rem)]" {video} horizontalCard />
                            {/each}
                        </div>
                    </ScrollArea>
                </div>
            </div>
        {/if}
    </div>
{/if}

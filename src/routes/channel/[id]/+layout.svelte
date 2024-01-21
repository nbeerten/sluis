<script lang="ts">
    import { Button } from "$lib/components/ui/button";
    import { enhance } from "$app/forms";
    import { toast } from "svelte-sonner";
    import SEO from "$lib/components/seo";
    import { Avatar, AvatarFallback, AvatarImage } from "$lib/components/ui/avatar";
    import { page } from "$app/stores";
    import ChevronRight from "~icons/lucide/chevron-right";
    import * as Dialog from "$lib/components/ui/dialog";

    export let data;
    let {
        channel,
        isSubscribed: { subscribed },
        loggedIn,
    } = data;
    $: channel = data.channel;
    $: subscribed = data.isSubscribed.subscribed;
    $: loggedIn = data.loggedIn;

    const { format } = Intl.NumberFormat("en", {
        notation: "compact",
    });

    let currentTab = "videos";
    $: currentTab = getTabFromPath($page.url.pathname);

    function getTabFromPath(path: string) {
        switch (true) {
            case path.endsWith(`/shorts`):
                return "shorts";
            case path.endsWith(`/livestreams`):
                return "livestreams";
            case path.endsWith(`/playlists`):
                return "playlists";
            default:
                return "videos";
        }
    }

    let aboutDialogOpen = false;
</script>

<SEO title={channel.name} robots={["noindex", "nofollow"]} />

<main>
    <hgroup class="space-y-4">
        <div class="overflow-hidden rounded-xl bg-primary-foreground [aspect-ratio:6/1]">
            <img src={channel.bannerUrl} alt="Banner" class="h-full w-full object-contain" />
        </div>
        <div class="flex flex-col justify-between md:flex-row md:items-center">
            <div class="flex items-center gap-4">
                <Avatar class="h-20 w-20 text-6xl">
                    <AvatarImage src={channel.avatarUrl} />
                    <AvatarFallback>
                        {channel.name.slice(0, 1)}
                    </AvatarFallback>
                </Avatar>
                <div>
                    <h1 class="text-2xl font-bold">
                        {channel.name}
                    </h1>
                    <p class="text-sm text-muted-foreground">
                        {format(channel.subscriberCount)} subscribers
                    </p>
                    <Dialog.Root
                        preventScroll={true}
                        open={aboutDialogOpen}
                        onOpenChange={(open) => {
                            aboutDialogOpen = open;
                        }}
                        onOutsideClick={(e) => {
                            e.preventDefault();
                            setTimeout(() => (aboutDialogOpen = false), 1);
                        }}>
                        <Dialog.Trigger>
                            <div
                                class="flex items-center justify-start text-sm text-muted-foreground md:max-w-[500px] xl:max-w-[600px]">
                                <p class="prose-sm line-clamp-1 h-[1lh] text-left">
                                    {channel.description}
                                </p>
                                <div>
                                    <ChevronRight class="h-4 w-4" />
                                </div>
                            </div>
                        </Dialog.Trigger>
                        <Dialog.Content class="overscroll-contain">
                            <Dialog.Header>
                                <Dialog.Title>About</Dialog.Title>
                            </Dialog.Header>
                            <p class="prose prose-neutral dark:prose-invert">
                                {@html channel.description}
                            </p>
                        </Dialog.Content>
                    </Dialog.Root>
                </div>
            </div>
            <div class="mt-4 w-full md:m-0 md:w-auto">
                {#if !subscribed && loggedIn}
                    <form
                        action="?/subscribe"
                        method="POST"
                        use:enhance
                        on:submit={() => toast.success(`Subscribed to ${channel.name}`)}>
                        <Button variant="default" type="submit" class="h-9 w-full md:h-10">
                            Subscribe
                        </Button>
                    </form>
                {:else if loggedIn}
                    <form
                        action="?/unsubscribe"
                        method="POST"
                        use:enhance
                        on:submit={() => toast.success(`Unsubscribed from ${channel.name}`)}>
                        <Button variant="secondary" type="submit" class="h-9 w-full md:h-10">
                            Unsubscribe
                        </Button>
                    </form>
                {/if}
            </div>
        </div>
    </hgroup>
    <div class="mt-4">
        <ul
            class="inline-flex h-10 w-full items-center justify-stretch rounded-md bg-muted p-1 text-muted-foreground md:w-auto md:justify-center">
            <li class="w-full">
                <a
                    href="/channel/{channel.id}"
                    data-state={currentTab === "videos" ? "active" : "inactive"}
                    class="inline-flex w-full items-center justify-center rounded-sm px-3 py-1.5 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm">
                    Videos
                </a>
            </li>

            {#each channel.tabs as { name }}
                <li class="w-full">
                    <a
                        href="/channel/{channel.id}/{name}"
                        data-state={currentTab === name ? "active" : "inactive"}
                        class="inline-flex w-full items-center justify-center rounded-sm px-3 py-1.5 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm">
                        {name.slice(0, 1).toUpperCase() + name.slice(1)}
                    </a>
                </li>
            {/each}
        </ul>
    </div>

    <slot />
</main>

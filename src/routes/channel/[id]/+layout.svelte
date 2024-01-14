<script lang="ts">
    import { Button } from "$lib/components/ui/button";
    import { enhance } from "$app/forms";
    import { toast } from "svelte-sonner";
    import SEO from "$lib/components/seo";
    import { Avatar, AvatarFallback, AvatarImage } from "$lib/components/ui/avatar";

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
</script>

<SEO title={channel.name} />

<main>
    <hgroup class="space-y-4">
        <div class="overflow-hidden rounded-2xl bg-primary-foreground [aspect-ratio:6/1]">
            <img src={channel.bannerUrl} alt="Banner" class="h-full w-full object-contain" />
        </div>
        <div class="flex items-center justify-between">
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
                </div>
            </div>
            <div>
                {#if !subscribed && loggedIn}
                    <form
                        action="?/subscribe"
                        method="POST"
                        use:enhance
                        on:submit={() => toast.success(`Subscribed to ${channel.name}`)}>
                        <Button variant="default" type="submit">Subscribe</Button>
                    </form>
                {:else if loggedIn}
                    <form
                        action="?/unsubscribe"
                        method="POST"
                        use:enhance
                        on:submit={() => toast.success(`Unsubscribed from ${channel.name}`)}>
                        <Button variant="secondary" type="submit">Unsubscribe</Button>
                    </form>
                {/if}
            </div>
        </div>
    </hgroup>

    <slot />
</main>

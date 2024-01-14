<script lang="ts">
    import { Avatar, AvatarFallback, AvatarImage } from '$lib/components/ui/avatar';
    import { Button } from '$lib/components/ui/button';
    import Check from '~icons/lucide/check';
    import { page } from '$app/stores';
    import { SheetClose } from '$lib/components/ui/sheet';

    export let subscriptions: { name: string; url: string; avatar: string; verified: boolean }[];
    export let closeSheet: boolean = false;
</script>

<h2 class="relative px-4 text-lg font-semibold tracking-tight">Subscriptions</h2>
<div class="space-y-1 py-1">
    {#if subscriptions.length > 0}
        {#each subscriptions as channel}
            {#if closeSheet}
                <SheetClose asChild let:builder>
                    <Button
                        href={channel.url}
                        variant={$page.url.pathname === channel.url ? 'secondary' : 'ghost'}
                        class="w-full justify-start gap-2 truncate font-normal"
                        builders={[builder]}
                    >
                        <Avatar class="h-8 w-8 text-xs">
                            <AvatarImage src={channel.avatar} />
                            <AvatarFallback>
                                {channel.name.slice(0, 1)}
                            </AvatarFallback>
                        </Avatar>
                        <span class="truncate">
                            {channel.name}
                        </span>
                        {#if channel.verified}
                            <Check class="h-4 w-4" />
                        {/if}
                    </Button>
                </SheetClose>
            {:else}
                <Button
                    href={channel.url}
                    variant={$page.url.pathname === channel.url ? 'secondary' : 'ghost'}
                    class="w-full justify-start gap-2 truncate font-normal"
                >
                    <Avatar class="h-8 w-8 text-xs">
                        <AvatarImage src={channel.avatar} />
                        <AvatarFallback>
                            {channel.name.slice(0, 1)}
                        </AvatarFallback>
                    </Avatar>
                    <span class="truncate">
                        {channel.name}
                    </span>
                    {#if channel.verified}
                        <Check class="h-4 w-4" />
                    {/if}
                </Button>
            {/if}
        {/each}
    {:else}
        <p>No subscriptions found</p>
    {/if}
</div>

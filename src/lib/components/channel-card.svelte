<script lang="ts">
    import { Avatar, AvatarFallback, AvatarImage } from '$lib/components/ui/avatar';
    import { Card, CardDescription, CardHeader, CardTitle } from '$lib/components/ui/card';
    import Check from '~icons/lucide/check';

    export let channel: {
        id: string;
        type: 'channel';
        name: string;
        thumbnail: string;
        description?: string | undefined;
        subscribers: number;
        videos: number;
        verified: boolean;
    };

    const { format: formatNumber } = Intl.NumberFormat('en', { notation: 'compact' });
</script>

<Card class="flex">
    <a href="/channel/{channel.id}" data-sveltekit-preload-data="tap">
        <div class="relative flex justify-center px-6 py-6">
            <Avatar class="h-24 w-24">
                <AvatarImage loading="lazy" src={channel.thumbnail ?? undefined} />
                <AvatarFallback>
                    {channel.name.slice(0, 1)}
                </AvatarFallback>
            </Avatar>
        </div>
    </a>

    <CardHeader>
        <div class="flex gap-2">
            <div class="flex items-start justify-center py-1">
                <a href="/channel/{channel.id}" data-sveltekit-preload-data="tap"> </a>
            </div>
            <div>
                <CardTitle class="line-clamp-2 text-base" title={channel.name}>
                    <a href="/channel/{channel.id}" data-sveltekit-preload-data="tap">
                        {channel.name}
                        {#if channel.verified}
                            <Check class="ml-0.5 inline-block h-4 w-4" />
                        {/if}
                    </a>
                </CardTitle>
                <CardDescription>
                    <span>
                        {formatNumber(channel.subscribers === -1 ? 0 : channel.subscribers)} subscribers
                    </span>
                    {#if channel.description}
                        <span class="mt-2 line-clamp-3">
                            {channel.description}
                        </span>
                    {/if}
                </CardDescription>
            </div>
        </div>
    </CardHeader>
</Card>

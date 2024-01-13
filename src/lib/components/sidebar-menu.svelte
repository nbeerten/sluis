<script lang="ts">
    import { Button } from '$lib/components/ui/button';
    import navItems from '$lib/nav-items';
    import { page } from '$app/stores';
    import { SheetClose } from '$lib/components/ui/sheet';

    let currentPath = $page.url.pathname;
    $: currentPath = $page.url.pathname;

    export let closeSheet: boolean = false;
</script>

<div class="space-y-1">
    {#each navItems as item}
        {#if closeSheet}
            <SheetClose asChild let:builder>
                <Button
                    href={item.href}
                    variant={currentPath === item.href ? 'secondary' : 'ghost'}
                    class="w-full justify-start"
                    builders={[builder]}
                >
                    <svelte:component this={item.icon} class="mr-2 h-5 w-5" />
                    {item.label}
                </Button>
            </SheetClose>
        {:else}
            <Button
                href={item.href}
                variant={currentPath === item.href ? 'secondary' : 'ghost'}
                class="w-full justify-start"
            >
                <svelte:component this={item.icon} class="mr-2 h-5 w-5" />
                {item.label}
            </Button>
        {/if}
    {/each}
</div>

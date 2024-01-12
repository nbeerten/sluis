<script>
    import '../app.pcss';
    import Waypoints from '~icons/lucide/waypoints';
    import Sidebar from '$lib/components/sidebar.svelte';
    import SidebarMenu from '$lib/components/sidebar-menu.svelte';
    import SidebarSubscriptions from '$lib/components/sidebar-subscriptions.svelte';
    import Menu from '~icons/lucide/menu';
    import { Button } from '$lib/components/ui/button';
    import * as Sheet from '$lib/components/ui/sheet';
    import { page } from '$app/stores';
    import { Input } from '$lib/components/ui/input';

    let currentPath = $page.url.pathname;
    $: currentPath = $page.url.pathname;

    export let data;
    const { subscriptions } = data;
</script>

<div class="mb-4 h-16">
    <nav
        class="fixed left-0 top-0 z-10 grid h-16 w-full grid-cols-[auto,1fr,auto] items-center border-b bg-background py-2 md:grid-cols-[16rem,1fr,16rem]"
    >
        <div class="flex px-3 md:w-64 md:pt-2">
            <h2
                class="mb-2 hidden items-center gap-3 px-4 text-lg font-semibold tracking-tight md:flex"
            >
                <Waypoints class="mb-0.5 h-6 w-6" />
                Sluis
            </h2>
            <div class="relative flex md:hidden">
                <Sheet.Root>
                    <Sheet.Trigger asChild let:builder
                        ><Button variant="ghost" builders={[builder]}
                            ><Menu class="h-6 w-6" /></Button
                        ></Sheet.Trigger
                    >
                    <Sheet.Content side="left" class="space-y-4">
                        <Sheet.Header>
                            <Sheet.Title class="flex items-center gap-2">
                                <Waypoints class="mb-0.5 h-6 w-6" />
                                Sluis
                            </Sheet.Title>
                        </Sheet.Header>
                        <div class="flex flex-col gap-1">
                            <SidebarMenu closeSheet />
                            {#if subscriptions}
                                <SidebarSubscriptions {subscriptions} closeSheet />
                            {/if}
                        </div></Sheet.Content
                    >
                </Sheet.Root>
            </div>
        </div>
        <div class="flex justify-center pr-2 md:pr-0">
            <form action="/search" class="flex w-full justify-center">
                <Input
                    type="search"
                    name="q"
                    placeholder="Search"
                    autocomplete="off"
                    class="w-full md:w-[40rem]"
                    value={$page.url.searchParams.get('q')}
                />
            </form>
        </div>
    </nav>
</div>
<Sidebar class="hidden md:block">
    <SidebarMenu />
    {#if subscriptions}
        <SidebarSubscriptions {subscriptions} />
    {/if}
</Sidebar>
<div class="w-full px-4 md:pl-64 md:pr-16">
    <slot />
</div>

<style lang="postcss">
    :root {
        font-family: Inter, sans-serif;
        font-feature-settings:
            'liga' 1,
            'calt' 1; /* fix for Chrome */
    }
    @supports (font-variation-settings: normal) {
        :root {
            font-family: InterVariable, sans-serif;
        }
    }
</style>

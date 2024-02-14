<script>
    import "../app.pcss";
    import "inter-ui/inter-variable.css";
    import Sidebar from "$lib/components/sidebar.svelte";
    import SidebarMenu from "$lib/components/sidebar-menu.svelte";
    import SidebarSubscriptions from "$lib/components/sidebar-subscriptions.svelte";
    import Menu from "~icons/lucide/menu";
    import { Button } from "$lib/components/ui/button";
    import * as Sheet from "$lib/components/ui/sheet";
    import Search from "$lib/components/search.svelte";
    import { Toaster } from "$lib/components/ui/sonner";
    import SEO from "$lib/components/seo";
    import { ModeWatcher } from "mode-watcher";
    import GitHub from "~icons/lucide/github";

    export let data;
    let { subscriptions } = data;
    $: subscriptions = data.subscriptions;
</script>

<SEO title="Home" robots={["nofollow"]} />

<ModeWatcher defaultMode="dark" />
<Toaster position="bottom-right" theme="system" closeButton={true} />

<div class="relative flex min-h-screen flex-col">
    <div class="mb-4 h-16">
        <nav
            class="fixed left-0 top-0 z-10 grid h-16 w-full grid-cols-[auto,1fr,auto] items-center justify-between border-b bg-background py-2 md:grid-cols-[16rem,1fr,16rem]">
            <div class="flex px-3 md:w-64 md:pt-2">
                <h2 class="mb-2 hidden flex-col justify-center gap-0.5 px-4 md:flex">
                    <span class="text-2xl font-extrabold leading-none dark:text-[#ffe7b3]">
                        Sluis
                    </span>
                    <span class="text-xs leading-none text-muted-foreground">
                        Based on <a href="https://piped.video" target="_blank" class="underline">
                            piped.video
                        </a>
                    </span>
                </h2>
                <div class="relative flex md:hidden">
                    <Sheet.Root>
                        <Sheet.Trigger asChild let:builder>
                            <Button variant="ghost" builders={[builder]}>
                                <Menu class="h-6 w-6" />
                            </Button>
                        </Sheet.Trigger>
                        <Sheet.Content side="left" class="space-y-4">
                            <Sheet.Header>
                                <Sheet.Title class="mb-2 flex flex-col justify-center gap-0.5 px-4">
                                    <span
                                        class="text-2xl font-extrabold leading-none dark:text-[#ffe7b3]">
                                        Sluis
                                    </span>
                                    <span class="text-xs leading-none text-muted-foreground">
                                        Based on <a
                                            href="https://piped.video"
                                            target="_blank"
                                            class="underline">
                                            piped.video
                                        </a>
                                    </span>
                                </Sheet.Title>
                            </Sheet.Header>
                            <div class="flex flex-col gap-3">
                                <SidebarMenu closeSheet />
                                {#if subscriptions}
                                    <SidebarSubscriptions {subscriptions} closeSheet />
                                {/if}
                            </div>
                        </Sheet.Content>
                    </Sheet.Root>
                </div>
            </div>
            <div class="flex flex-grow justify-center pr-2 md:pr-0">
                <Search />
            </div>
            <div class="flex justify-end px-3">
                <a href="https://github.com/nbeerten/sluis" target="_blank" rel="noreferrer">
                    <GitHub />
                </a>
            </div>
        </nav>
    </div>
    <Sidebar class="hidden space-y-4 md:block">
        <SidebarMenu />
        {#if subscriptions}
            <SidebarSubscriptions {subscriptions} />
        {/if}
    </Sidebar>
    <div class="w-full px-4 md:pl-64 md:pr-16">
        <slot />
    </div>
</div>

<style lang="postcss">
    :root {
        --font-sans: Inter, sans-serif;
        font-feature-settings:
            "liga" 1,
            "calt" 1; /* fix for Chrome */
    }
    @supports (font-variation-settings: normal) {
        :root {
            --font-sans: InterVariable, sans-serif;
        }
    }
</style>

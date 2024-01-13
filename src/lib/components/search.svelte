<script lang="ts">
    import { page } from '$app/stores';
    import { Input } from '$lib/components/ui/input';
    import { slide } from 'svelte/transition';
    import SearchIcon from '~icons/lucide/search';
    import { defaultInstance } from '$lib/api';

    let value: string = $page.url.searchParams.get('q') || '';
    let open = false;
    let instance: string = $page.data.instance.url || defaultInstance;

    let suggestions: string[] = [];

    async function fetchSuggestions(value: string) {
        return fetch(`${instance}/suggestions?${new URLSearchParams({ query: value })}`).then((r) =>
            r.json()
        ) as Promise<string[]>;
    }

    let timer: number;
    const debounce = (v: string) => {
        clearTimeout(timer);
        timer = setTimeout(async () => {
            suggestions = v ? await fetchSuggestions(v) : [];
        }, 250);
    };
</script>

<form action="/search" method="GET" class="flex w-full justify-center">
    <div class="relative w-full md:w-[40rem]">
        <Input
            type="search"
            name="q"
            placeholder="Search"
            autocomplete="off"
            class="w-full"
            bind:value
            on:keyup={() => debounce(value)}
            on:focusin={() => (open = true)}
            on:focusout={() =>
                setTimeout(() => {
                    open = false;
                }, 100)}
        />
        {#if value && value.length > 0 && open && suggestions.length > 0}
            <div
                class="absolute left-1/2 top-0 mt-1 w-full -translate-x-1/2 translate-y-[2.5rem] rounded-md border bg-background drop-shadow-lg"
            >
                <ul class="flex flex-col" transition:slide>
                    {#each suggestions as suggestion}
                        <li transition:slide>
                            <a
                                href="/search?{new URLSearchParams({ q: suggestion }).toString()}"
                                class="flex items-center gap-2 px-4 py-1.5 text-sm text-muted-foreground hover:bg-secondary"
                                ><SearchIcon /> {suggestion}</a
                            >
                        </li>
                    {/each}
                </ul>
            </div>
        {/if}
    </div>
</form>

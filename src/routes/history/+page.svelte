<script lang="ts">
    import { onMount } from "svelte";
    import VideoCard from "$lib/components/video-card.svelte";
    import { liveQuery, type Observable } from "dexie";
    import { Button } from "$lib/components/ui/button";
    import { browser } from "$app/environment";
    import SEO from "$lib/components/seo";

    let history: Observable<
        {
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
        }[]
    >;

    onMount(async () => {
        const db = (await import("$lib/indexeddb")).db;

        // history = (await db.videos.reverse().toArray()).map((v) => v.video);
        history = liveQuery(async () => {
            return await db.videos
                .orderBy("watchedAt")
                .reverse()
                .toArray()
                .then((videos) => videos.map((v) => v.video));
        });
    });

    async function clearHistory() {
        if (!browser) return;

        const db = (await import("$lib/indexeddb")).db;
        db.videos.clear();
    }
</script>

<SEO title="Watch History" robots={["noindex", "nofollow"]} />

<main>
    <hgroup class="flex justify-between">
        <h1 class="text-3xl font-bold">Watch history</h1>
        <Button variant="destructive" on:click={clearHistory}>Clear</Button>
    </hgroup>

    <div class="grid grid-cols-1 gap-4 py-5 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
        {#if $history}
            {#each $history as video, i}
                <VideoCard {video} lazyImage={i >= 8} />
            {/each}
        {/if}
    </div>
</main>

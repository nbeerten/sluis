<script lang="ts">
    import VideoCard from "$lib/components/video-card.svelte";
    import SEO from "$lib/components/seo";

    export let data;
</script>

<SEO title="Trending" robots={["nofollow"]} />

<main>
    <hgroup>
        <h1 class="text-3xl font-bold">Trending in {data.country}</h1>
    </hgroup>
    <div class="grid grid-cols-1 gap-4 py-5 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
        {#each data.videos as video}
            <VideoCard
                video={{
                    id: video.url.slice(9),
                    title: video.title,
                    thumbnail: video.thumbnail,
                    uploader: {
                        name: video.uploaderName,
                        id: video.uploaderUrl.slice(9),
                        avatar: video.uploaderAvatar,
                        verified: video.uploaderVerified,
                    },
                    duration: video.duration,
                    uploadDate: video.uploaded,
                    views: video.views,
                }} />
        {/each}
    </div>
</main>

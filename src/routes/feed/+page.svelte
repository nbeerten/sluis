<script lang="ts">
    import { Button } from "$lib/components/ui/button";
    import { Tabs, TabsContent, TabsList, TabsTrigger } from "$lib/components/ui/tabs";
    import VideoCard from "$lib/components/video-card.svelte";
    import SEO from "$lib/components/seo";

    export let data;
    let { videos, loggedIn } = data;
    $: loggedIn = data.loggedIn;
    let longVideos: typeof videos, shortVideos: typeof videos;
    $: longVideos = data.videos?.filter((v) => !v.isShort);
    $: shortVideos = data.videos?.filter((v) => v.isShort);
</script>

<SEO title="Feed" robots={["noindex", "nofollow"]} />

<main>
    <hgroup>
        <h1 class="text-3xl font-bold">Feed</h1>
    </hgroup>
    {#if loggedIn}
        <Tabs class="h-full py-4">
            <TabsList>
                <TabsTrigger value="videos" class="relative">Videos</TabsTrigger>
                <TabsTrigger value="shorts">Shorts</TabsTrigger>
            </TabsList>
            <TabsContent value="videos" class="border-none p-0 outline-none">
                <div
                    class="grid grid-cols-1 gap-4 py-5 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                    {#if longVideos}
                        {#each longVideos as video, i}
                            <VideoCard
                                video={{
                                    id: video.url.slice(9),
                                    title: video.title,
                                    thumbnail: video.thumbnail,
                                    uploader: {
                                        name: video.uploaderName,
                                        avatar: video.uploaderAvatar,
                                        id: video.uploaderUrl.slice(9),
                                        verified: video.uploaderVerified,
                                    },
                                    duration: video.duration,
                                    uploadDate: video.uploaded,
                                    views: video.views,
                                }}
                                lazyImage={i >= 8} />
                        {/each}
                    {:else}
                        <div class="flex justify-center">
                            <p>No videos found</p>
                        </div>
                    {/if}
                </div>
            </TabsContent>
            <TabsContent
                value="shorts"
                class="h-full flex-col border-none p-0 data-[state=active]:flex">
                <div
                    class="grid grid-cols-1 gap-4 py-5 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6">
                    {#if shortVideos}
                        {#each shortVideos as video, i}
                            <VideoCard
                                video={{
                                    id: video.url.slice(9),
                                    title: video.title,
                                    thumbnail: video.thumbnail,
                                    uploader: {
                                        name: video.uploaderName,
                                        avatar: video.uploaderAvatar,
                                        id: video.uploaderUrl.slice(9),
                                        verified: video.uploaderVerified,
                                    },
                                    duration: video.duration,
                                    uploadDate: video.uploaded,
                                    views: video.views,
                                }}
                                lazyImage={i >= 6}
                                isShort
                                bareCard />
                        {/each}
                    {/if}
                </div>
            </TabsContent>
        </Tabs>
    {:else}
        <div class="flex items-center gap-2 pt-2">
            <Button href="/login">Login</Button>
            <p>to use the feed</p>
        </div>
    {/if}
</main>

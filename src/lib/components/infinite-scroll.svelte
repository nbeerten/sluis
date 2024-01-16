<script lang="ts">
    import { onMount } from "svelte";

    export let hasMore = true;
    export let onLoadMore: () => Promise<void> | void;

    let component: HTMLDivElement;

    onMount(() => {
        let observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    if (hasMore) {
                        onLoadMore();
                    }
                }
            },
            {
                root: null, // defaults to document viewport
                rootMargin: "500px",
                threshold: 0,
            }
        );

        observer.observe(component);

        return () => {
            observer.unobserve(component);
            observer.disconnect();
        };
    });
</script>

<div bind:this={component} class="my-px h-px" />

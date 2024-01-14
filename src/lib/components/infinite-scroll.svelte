<script lang="ts">
    import { browser } from "$app/environment";
    import { onDestroy, createEventDispatcher, onMount } from "svelte";

    export let hasMore = true;

    const dispatch = createEventDispatcher();
    let isLoadMore = false;
    let component: HTMLDivElement;

    onMount(() => {
        document.addEventListener("scroll", onScroll);
        document.addEventListener("resize", onScroll);
    });

    function isInViewport(element: HTMLElement) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }

    const onScroll = () => {
        if (isInViewport(component)) {
            if (!isLoadMore && hasMore) {
                dispatch("loadMore");
            }
            isLoadMore = true;
        } else {
            isLoadMore = false;
        }
    };

    onDestroy(() => {
        if (browser) {
            document.removeEventListener("scroll", onScroll);
            document.removeEventListener("resize", onScroll);
        }
    });
</script>

<div bind:this={component} />

<script lang="ts">
    import { browser } from "$app/environment";
    import { onDestroy, createEventDispatcher, onMount } from "svelte";
    import { toast } from "svelte-sonner";

    export let hasMore = true;

    const dispatch = createEventDispatcher();
    let component: HTMLDivElement;

    onMount(() => {
        let observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                if(hasMore) dispatch("loadMore");
            }
        }, {
            root: null, // defaults to document viewport
            rootMargin: "500px",
            threshold: 0,
        });

        observer.observe(component);

        return () => {
            observer.unobserve(component);
            observer.disconnect();
        }
    });

    // function isInViewport(element: HTMLElement) {
    //     const rect = element.getBoundingClientRect();
    //     return (
    //         rect.top >= 0 &&
    //         rect.left >= 0 &&
    //         rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    //         rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    //     );
    // }

    // const onScroll = () => {
    //     if (isInViewport(component)) {
    //         if (!isLoadMore && hasMore) {
    //             dispatch("loadMore");
    //         }
    //         isLoadMore = true;
    //     } else {
    //         isLoadMore = false;
    //     }
    // };

    // onDestroy(() => {
    //     if (browser) {
    //         document.removeEventListener("scroll", onScroll);
    //         document.removeEventListener("resize", onScroll);
    //     }
    // });
</script>

<div bind:this={component} class="h-px my-px"/>

<style>
    .int-obs {
        position: relative;
    }

    .int-obs::after {
        content: "";
        position: absolute;
        top: 0;
        translate: 0 -500px;
        left: 0;
        right: 0;
        height: 500px;
        width: 100%;
        background: red;
    }
</style>
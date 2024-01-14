<script lang="ts">
    export let title: string;
    export let description: string | undefined = undefined;
    export let image: string | undefined = undefined;
    export let robots: string[] | undefined = undefined;
</script>

<svelte:head>
    <title>{title} - Sluis</title>
    {#if description}
        <meta name="description" content={description} />
    {/if}

    {#if description}
        <meta property="og:title" content={title} />
        <meta name="twitter:title" content={title} />
        <meta property="og:description" content={description} />
        <meta name="twitter:description" content={description} />
    {/if}
    {#if image}
        <meta property="og:image" content={image} />
        <meta name="twitter:image" content={image} />
    {/if}

    {#if robots && robots.length > 0}
        <meta name="robots" content={robots.join(", ")} />
    {/if}
</svelte:head>

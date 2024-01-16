<script lang="ts">
    import { page } from "$app/stores";
</script>

<main>
    <hgroup>
        <h1 class="text-3xl font-bold">Error {$page.status}</h1>
        <p class="text-sm text-muted-foreground">{$page.error?.message}</p>
        <p>Try switching to another instance in the left sidebar</p>
    </hgroup>
</main>

<script lang="ts">
    import { Input } from "$lib/components/ui/input";
    import { Button } from "$lib/components/ui/button";
    import ArrowRight from "~icons/lucide/arrow-right";
    import { enhance } from "$app/forms";
    import SEO from "$lib/components/seo";

    export let form;
</script>

<SEO title="Login" />

<form method="POST" class="space-y-3" use:enhance>
    <Input type="text" name="username" placeholder="Username" autocomplete="username" autofocus />
    <Input type="password" name="password" placeholder="Password" autocomplete="current-password" />
    {#if form?.error}
        <p class="text-red-500">{form?.error}</p>
    {/if}
    <Button type="submit" class="mt-4 w-full">
        Log in
        <ArrowRight class="ml-auto h-5 w-5 text-gray-50" />
    </Button>
</form>

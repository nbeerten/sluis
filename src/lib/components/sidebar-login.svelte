<script lang="ts">
    import { Button } from "$lib/components/ui/button";
    import * as Select from "$lib/components/ui/select";
    import { page } from "$app/stores";
    import type { Instances } from "$lib/api";
    import ArrowLeftRight from "~icons/lucide/arrow-left-right";
    import { enhance } from "$app/forms";
    import { toast } from "svelte-sonner";
    import { SheetClose } from "$lib/components/ui/sheet";

    export let instanceList: Instances;
    export let closeSheet: boolean = false;

    let instanceItems: {
        value: string;
        label: string;
    }[];
    $: instanceItems = instanceList.map((i) => ({
        value: i.api_url,
        label: `${i.name} (${i.locations})`,
    }));

    const extractInstanceFromEvent = (e: SubmitEvent) => {
        const formData = new FormData(e.target as HTMLFormElement);
        return formData.get("instance") as string;
    };

    let selectValue = $page.data.instance.url as string;
</script>

<div class="flex flex-col gap-2">
    {#if $page.data.loggedIn}
        {#if closeSheet}
            <SheetClose asChild let:builder>
                <Button
                    builders={[builder]}
                    href="/logout?to=${encodeURIComponent('/')}"
                    variant="secondary"
                    class="w-full"
                    on:click={() => toast.info("Logging out...")}>
                    Logout
                </Button>
            </SheetClose>
        {:else}
            <Button
                href="/logout?to=${encodeURIComponent('/')}"
                variant="secondary"
                class="w-full"
                on:click={() => toast.info("Logging out...")}>
                Logout
            </Button>
        {/if}
    {:else if closeSheet}
        <SheetClose asChild let:builder>
            <Button
                href="/login"
                variant="secondary"
                class="w-full justify-start"
                builders={[builder]}>
                Login
            </Button>
        </SheetClose>
    {:else}
        <Button href="/login" variant="secondary" class="w-full justify-start">Login</Button>
    {/if}

    <form
        action="/?/switchInstance"
        method="POST"
        class="flex max-w-full justify-between gap-1"
        use:enhance
        on:submit={(e) => toast.success(`Switched instance to ${extractInstanceFromEvent(e)}`)}>
        <Select.Root
            items={instanceItems}
            preventScroll={false}
            selected={instanceItems.find((i) => i.value === $page.data.instance.url)}
            onSelectedChange={(i) => (selectValue = i?.value ?? selectValue)}>
            <Select.Trigger class="w-full">
                <Select.Value placeholder="Instance" class="line-clamp-1" />
            </Select.Trigger>
            <Select.Content class="z-0">
                <Select.Label>Instances</Select.Label>
                {#each instanceItems as { value, label }}
                    <Select.Item {value} {label}>
                        {label}
                    </Select.Item>
                {/each}
            </Select.Content>
            <Select.Input name="instance" />
        </Select.Root>
        <Button
            type="submit"
            class="grid aspect-square place-content-center p-1"
            disabled={selectValue === $page.data.instance.url}>
            <ArrowLeftRight />
        </Button>
    </form>
</div>

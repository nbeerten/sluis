<script lang="ts">
    import * as Form from "$lib/components/ui/form";
    import { sponsorSchema, instanceSchema } from "./schema";
    import { outputObject } from "./schema";
    import SEO from "$lib/components/seo";
    import { Card, CardTitle, CardContent, CardHeader } from "$lib/components/ui/card";
    import { Button } from "$lib/components/ui/button";
    import { page } from "$app/stores";
    import { toast } from "svelte-sonner";
    import { autoplay, seekAmount, startMuted, timeTillNext } from "$lib/stores";
    import { Label } from "$lib/components/ui/label";
    import { Switch } from "$lib/components/ui/switch/";
    import { Input } from "$lib/components/ui/input";
    import Search from "$lib/components/search.svelte";

    export let data;
    let { instances } = data;
    $: instances = data.instances;

    const instanceList = instances.map((i) => ({
        value: i.api_url,
        label: `${i.name} (${i.uptime_30d.toFixed(1)}%)`,
        sublabel: `${i.registered} users | ${i.locations} ${i.cdn ? " | CDN" : ""}`,
    }));

    const validCategories = Object.entries(outputObject).map(([key, _]) =>
        key.slice("sponsor_".length)
    ) as (keyof typeof outputObject extends `sponsor_${infer T}` ? T : never)[];

    let selected = instanceList.find((i) => i.value === data.instance.url) as
        | (typeof instanceList)[number]
        | undefined;
    const setSelected = (i: unknown) => (selected = i as typeof selected);
    const readSelected = () => selected?.value;

    $: if ($page.form?.instanceForm?.posted ?? false) {
        toast.success(`Switched instance to ${readSelected()}`);
    }

    $: if ($page.form?.sponsorForm?.posted ?? false) {
        toast.success(`Saved sponsor category preferences to cookies.`);
    }
</script>

<SEO title="Settings" />

<main class="max-w-lg pb-4">
    <hgroup class="pb-2">
        <h1 class="text-3xl font-bold">Settings</h1>
    </hgroup>

    {#if data.instance.name}
        <div class="flex flex-col gap-2 pb-4">
            <div class="flex gap-2">
                <Button href="/login" variant="default" class="w-full">
                    Login on {data.instance.name}
                </Button>
                <Button variant="default" disabled>Register on {data.instance.name}</Button>
            </div>
            {#if data.loggedIn}
                <Button variant="outline" class="border-red-900 hover:bg-red-900" href="/logout">
                    Log out of {data.instance.name}
                </Button>
            {/if}
        </div>
    {/if}

    <Form.Root
        method="POST"
        action="?/instance"
        form={data.instanceForm}
        schema={instanceSchema}
        let:config>
        <div class="mb-2 flex flex-col gap-1">
            <Form.Field {config} name="instance">
                <Form.Item>
                    <Form.Label>Instance</Form.Label>
                    <Form.Select
                        preventScroll={false}
                        {selected}
                        onSelectedChange={(i) => setSelected(i)}>
                        <Form.SelectTrigger class="w-full" placeholder="Selected an instance..." />
                        <Form.SelectContent
                            class="z-0 max-h-[30rem] overflow-y-scroll overscroll-contain">
                            {#each instanceList as { value, label, sublabel }}
                                <Form.SelectItem
                                    {value}
                                    {label}
                                    class="flex-col items-start justify-center text-left">
                                    <span>{label}</span>
                                    <span class="text-xs text-muted-foreground">{sublabel}</span>
                                </Form.SelectItem>
                            {/each}
                        </Form.SelectContent>
                    </Form.Select>
                    <Form.Validation />
                </Form.Item>
            </Form.Field>

            <div>
                <Card>
                    <CardHeader class="pb-2">
                        <CardTitle>Instance Information</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {#if selected}
                            <table class="text-sm text-muted-foreground">
                                {#each Object.entries(instances.find((i) => i.api_url === selected?.value) ?? {}) as [key, value]}
                                    <tr>
                                        <td class="pr-4 font-semibold">{key}</td>
                                        <td>{value}</td>
                                    </tr>
                                {/each}
                            </table>
                        {:else}
                            <p class="text-muted-foreground leading-snug">Selected instance not available at this moment. Most likely cause is that the selected instance is offline or has an outage. Either select a different instance or try again later.</p>
                        {/if}
                    </CardContent>
                </Card>
            </div>

            <Form.Button
                type="submit"
                class="w-full"
                disabled={(selected?.value === data.instance.url) || !selected}>
                Switch to instance
            </Form.Button>
        </div>
    </Form.Root>

    <Form.Root
        method="POST"
        action="?/sponsor"
        form={data.sponsorForm}
        schema={sponsorSchema}
        let:config>
        <div class="flex flex-col gap-1 py-4">
            <div class="mb-2 flex flex-col gap-0">
                <p class="text-xl font-semibold">Sponsorblock Categories</p>
                <p class="text-sm text-muted-foreground">
                    Using <a href="https://sponsor.ajay.app/" target="_blank" class="underline">
                        SponsorBlock.
                    </a>
                    Sponsor category preferences are stored in your cookies.
                </p>
            </div>
            {#each validCategories as category}
                <Form.Field {config} name="sponsor_{category}">
                    <Form.Item class="border-b border-border">
                        <div class="flex items-center justify-between gap-2">
                            <Form.Label>{category}</Form.Label>
                            <Form.Checkbox />
                        </div>
                        <Form.Validation />
                    </Form.Item>
                </Form.Field>
            {/each}
        </div>
        <div class="flex justify-end gap-2">
            <Form.Button type="submit" variant="secondary" class="w-full">Save</Form.Button>
        </div>
    </Form.Root>

    <div class="flex flex-col gap-1 py-4">
        <div class="mb-2 flex flex-col gap-0">
            <p class="text-xl font-semibold">Video player options</p>
            <p class="text-sm text-muted-foreground">Automatically saves options to your browser</p>
        </div>

        <div class="flex flex-col gap-2">
            <div class="flex items-center justify-between">
                <Label>Autoplay</Label>
                <Switch bind:checked={$autoplay} id="autoplay" class="scale-90" />
            </div>
            <div class="flex items-center justify-between">
                <Label>Start muted</Label>
                <Switch bind:checked={$startMuted} id="startMuted" class="scale-90" />
            </div>
            <div class="flex items-center justify-between">
                <Label>Seek amount</Label>
                <Input
                    type="text"
                    inputmode="numeric"
                    min="0"
                    pattern="[0-9]*"
                    bind:value={$seekAmount}
                    id="seekAmount"
                    class="h-8 w-16" />
            </div>
            <div class="flex items-center justify-between">
                <Label>Time until next video</Label>
                <Input
                    type="text"
                    inputmode="numeric"
                    min="0"
                    pattern="[0-9]*"
                    bind:value={$timeTillNext}
                    id="timeTillNext"
                    class="h-8 w-16" />
            </div>
        </div>
    </div>
</main>

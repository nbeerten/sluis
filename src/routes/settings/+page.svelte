<script lang="ts">
    import {
        FormButton,
        FormControl,
        FormField,
        FormFieldErrors,
        FormLabel,
    } from "$lib/components/ui/form";
    import {
        Select,
        SelectContent,
        SelectInput,
        SelectItem,
        SelectTrigger,
        SelectValue,
    } from "$lib/components/ui/select";
    import { sponsorSchema, instanceSchema, deleteAccountSchema } from "./schema";
    import { outputObject } from "./schema";
    import SEO from "$lib/components/seo";
    import { Card, CardTitle, CardContent, CardHeader } from "$lib/components/ui/card";
    import { Button } from "$lib/components/ui/button";
    import { toast } from "svelte-sonner";
    import { autoplay, seekAmount, startMuted, timeTillNext, subtitles } from "$lib/stores";
    import { Label } from "$lib/components/ui/label";
    import { Switch } from "$lib/components/ui/switch/";
    import { Input } from "$lib/components/ui/input";
    import { toggleMode, mode } from "mode-watcher";
    import Check from "~icons/lucide/check";
    import X from "~icons/lucide/x";
    import HelpCircle from "~icons/lucide/help-circle";
    import * as HoverCard from "$lib/components/ui/hover-card";
    import { superForm } from "sveltekit-superforms";
    import { zodClient } from "sveltekit-superforms/adapters";
    import { Checkbox } from "$lib/components/ui/checkbox";
    import type { Instances } from "$lib/api";
    import {
        Dialog,
        DialogContent,
        DialogTrigger,
        DialogDescription,
        DialogTitle,
        DialogHeader,
        DialogFooter,
    } from "$lib/components/ui/dialog";

    export let data;
    let { instances } = data;
    $: instances = data.instances;

    const instanceForm = superForm(data.instanceForm, {
        validators: zodClient(instanceSchema),
        resetForm: false,
    });
    const {
        form: instanceFormData,
        enhance: instanceEnhance,
        posted: instanceFormPosted,
    } = instanceForm;

    const sponsorForm = superForm(data.sponsorForm, {
        validators: zodClient(sponsorSchema),
        resetForm: false,
    });
    const {
        form: sponsorFormData,
        enhance: sponsorEnhance,
        posted: sponsorFormPosted,
    } = sponsorForm;

    const deleteAccountForm = superForm(data.deleteAccountForm, {
        validators: zodClient(deleteAccountSchema),
        resetForm: false,
    });
    const {
        form: deleteAccountFormData,
        enhance: deleteAccountEnhance,
        posted: deleteAccountFormPosted,
    } = deleteAccountForm;

    const instanceList = (instances as Instances).map((i) => ({
        value: i.api_url,
        label: `${i.name} (${i.uptime_30d.toFixed(1)}%)`,
        sublabel: `${i.registered} users | ${i.locations} ${i.cdn ? " | CDN" : ""}`,
    }));

    const validCategories = Object.entries(outputObject).map(([key]) =>
        key.slice("sponsor_".length)
    ) as (keyof typeof outputObject extends `sponsor_${infer T}` ? T : never)[];

    let selected = instanceList.find((i) => i.value === data.instance.url) as
        | (typeof instanceList)[number]
        | undefined;

    $: selectedInstance = $instanceFormData.instance
        ? {
              label: instanceList.find((i) => i.value === $instanceFormData.instance)?.label,
              value: $instanceFormData.instance,
          }
        : undefined;

    const readInstance = () => $instanceFormData.instance;
    $: if ($instanceFormPosted ?? false) {
        toast.success(`Switched instance to ${readInstance()}`);
    }

    $: if ($sponsorFormPosted ?? false) {
        toast.success(`Saved sponsor category preferences to cookies.`);
    }

    $: if ($deleteAccountFormPosted ?? false) {
        toast.success(`Deleted account.`);
    }

    const { format: formatNumber } = Intl.NumberFormat("en", { notation: "compact" });

    function formatInstanceInformation(i: Instances[number] | undefined) {
        if (!i) return [];
        return [
            ["Name", i.name],
            ["API url", i.api_url],
            ["Locations", i.locations],
            ["Version", i.version],
            ["Up to date?", i.up_to_date],
            ["Has CDN?", i.cdn],
            ["Registered users", formatNumber(i.registered)],
            [
                "Last checked",
                `${new Date(i.last_checked * 1000).toLocaleString("en-UK", { timeZone: "UTC" })} (UTC)`,
            ],
            ["Has cache?", i.cache],
            ["Has S3 enabled?", i.s3_enabled],
            ["Image proxy url", i.image_proxy_url],
            ["Registration disabled?", i.registration_disabled],
            ["Uptime last 24h", `${i.uptime_24h.toFixed(1)}%`],
            ["Uptime last 7d", `${i.uptime_7d.toFixed(1)}%`],
            ["Uptime last 30d", `${i.uptime_30d.toFixed(1)}%`],
        ] as const;
    }

    function formatCategoryName(category: (typeof validCategories)[number]) {
        const convert: Record<(typeof validCategories)[number], string> = {
            sponsor: "Sponsors",
            intro: "Intermission/Intro Animation",
            outro: "Endcards/Credits",
            preview: "Preview/Recap/Hook",
            interaction: "Interaction Reminder (Subscribe)",
            selfpromo: "Unpaid/Self Promotion",
            music_offtopic: "Music: Non-Music Section",
            filler: "Filler Tangent/Jokes",
        } as const;
        return convert[category];
    }

    function formatCategoryDescription(category: (typeof validCategories)[number]) {
        const convert: Record<
            (typeof validCategories)[number],
            { href: string; description: string }
        > = {
            sponsor: {
                href: "https://wiki.sponsor.ajay.app/w/Sponsor",
                description: "Paid promotion, paid referrals and direct advertisements.",
            },
            intro: {
                href: "https://wiki.sponsor.ajay.app/w/Intermission/Intro_Animation",
                description:
                    "An interval without actual content. Could be a pause, static frame, repeating animation.",
            },
            outro: {
                href: "https://wiki.sponsor.ajay.app/w/Endcards/Credits",
                description: "Credits or when the YouTube endcards appear.",
            },
            preview: {
                href: "https://wiki.sponsor.ajay.app/w/Preview/Recap/Hook",
                description:
                    "Collection of clips that show what is coming up in in this video or other videos in a series where all information is repeated later in the video.",
            },
            interaction: {
                href: "https://wiki.sponsor.ajay.app/w/Interaction_Reminder_(Subscribe)",
                description: "Reminder that you are subscribed to the channel.",
            },
            selfpromo: {
                href: "https://wiki.sponsor.ajay.app/w/Unpaid/Self_Promotion",
                description:
                    'Similar to "sponsor" except for unpaid or self promotion. This includes sections about merchandise, donations, or information about who they collaborated with.',
            },
            music_offtopic: {
                href: "https://wiki.sponsor.ajay.app/w/Music:_Non-Music_Section",
                description:
                    "For use in music videos. This only should be used for sections of music videos that aren't already covered by another category.",
            },
            filler: {
                href: "https://wiki.sponsor.ajay.app/w/Filler_Tangent",
                description:
                    "Tangential scenes added only for filler or humor that are not required to understand the main content of the video. This should not include segments providing context or background details.",
            },
        };
        return convert[category];
    }
</script>

<SEO title="Settings" />

<main class="max-w-lg pb-4">
    <hgroup class="pb-2">
        <h1 class="text-3xl font-bold">Settings</h1>
    </hgroup>

    <p class="text-xl font-semibold">General</p>
    <div class="flex items-center justify-between gap-2 py-2">
        <Label for="darkMode">Dark mode</Label>
        <Switch
            id="darkMode"
            checked={$mode === "dark"}
            onCheckedChange={toggleMode}
            class="scale-90" />
    </div>

    <hr class="my-2 border-border" />

    <p class="pb-2 text-xl font-semibold">Instance</p>
    {#if data.instance.name}
        <div class="flex flex-col gap-2 pb-4">
            {#if !data.loggedIn}
                <div class="flex gap-2">
                    <Button href="/login" variant="default" class="w-full">
                        Login on {data.instance.name}
                    </Button>
                    {#if !data.instance.registration_disabled}
                        <Button variant="default" href="/register">
                            Register on {data.instance.name}
                        </Button>
                    {:else}
                        <Button variant="default" disabled>
                            Register on {data.instance.name}
                        </Button>
                    {/if}
                </div>
            {:else}
                <div class="flex gap-2">
                    <Button
                        variant="outline"
                        class="w-full border-red-600 hover:bg-red-600 hover:text-white dark:border-red-900 dark:text-inherit dark:hover:bg-red-900"
                        href="/logout">
                        Log out of {data.instance.name}
                    </Button>

                    <Dialog>
                        <DialogTrigger asChild let:builder>
                            <Button
                                variant="outline"
                                class="border-red-600 hover:bg-red-600 hover:text-white dark:border-red-900 dark:text-inherit dark:hover:bg-red-900"
                                builders={[builder]}>
                                Delete account
                            </Button>
                        </DialogTrigger>
                        <DialogContent class="sm:max-w-[30rem]">
                            <DialogHeader>
                                <DialogTitle>Delete account</DialogTitle>
                                <DialogDescription>
                                    Are you sure you want to delete your account on {data.instance
                                        .name}?
                                </DialogDescription>
                            </DialogHeader>
                            <form method="POST" action="?/deleteAccount" use:deleteAccountEnhance>
                                <FormField form={deleteAccountForm} name="password">
                                    <FormControl let:attrs>
                                        <FormLabel>Password</FormLabel>
                                        <Input
                                            type="password"
                                            autocomplete="current-password"
                                            {...attrs}
                                            bind:value={$deleteAccountFormData.password} />
                                    </FormControl>
                                    <FormFieldErrors />
                                </FormField>
                                <DialogFooter>
                                    <Button variant="destructive" type="submit">Delete</Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>
            {/if}
        </div>
    {/if}

    <form method="POST" action="?/instance" use:instanceEnhance>
        <div class="mb-2 flex flex-col gap-1">
            <FormField form={instanceForm} name="instance">
                <FormControl let:attrs>
                    <FormLabel>Instance</FormLabel>
                    <Select
                        items={instanceList}
                        preventScroll={false}
                        selected={selectedInstance}
                        onSelectedChange={(v) => {
                            v && ($instanceFormData.instance = v.value);
                        }}>
                        <SelectInput name={attrs.name} />
                        <SelectTrigger class="w-full" {...attrs}>
                            <SelectValue placeholder="Selected an instance..." />
                        </SelectTrigger>
                        <SelectContent
                            class="z-0 max-h-[30rem] overflow-y-scroll overscroll-contain">
                            {#each instanceList as { value, label, sublabel }}
                                <SelectItem
                                    {value}
                                    {label}
                                    class="flex-col items-start justify-center text-left">
                                    <span>{label}</span>
                                    <span class="text-xs text-muted-foreground">{sublabel}</span>
                                </SelectItem>
                            {/each}
                        </SelectContent>
                    </Select>
                </FormControl>
                <FormFieldErrors />
            </FormField>

            <div>
                <Card>
                    <CardHeader class="pb-2">
                        <CardTitle>Instance Information</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {#if selected && instances}
                            <table class="text-sm text-muted-foreground">
                                {#each formatInstanceInformation(instances.find((i) => i.api_url === selected?.value)) as [key, value]}
                                    <tr>
                                        <td class="pr-4 font-semibold">{key}</td>
                                        <td>
                                            {#if typeof value === "boolean"}
                                                {#if value}
                                                    <Check />
                                                {:else}
                                                    <X />
                                                {/if}
                                            {:else}
                                                {value}
                                            {/if}
                                        </td>
                                    </tr>
                                {/each}
                            </table>
                        {:else}
                            <p class="leading-snug text-muted-foreground">
                                Selected instance not available at this moment. Most likely cause is
                                that the selected instance is offline or has an outage. Either
                                select a different instance or try again later.
                            </p>
                        {/if}
                    </CardContent>
                </Card>
            </div>

            <FormButton
                type="submit"
                class="w-full"
                disabled={selectedInstance?.value === data.instance.url || !selectedInstance}>
                Switch to instance
            </FormButton>
        </div>
    </form>

    <form method="POST" action="?/sponsor" use:sponsorEnhance>
        <div class="flex flex-col gap-1 py-4">
            <div class="mb-2 flex flex-col gap-0">
                <p class="text-xl font-semibold">Sponsorblock</p>
                <p class="text-sm text-muted-foreground">
                    Using <a href="https://sponsor.ajay.app/" target="_blank" class="underline">
                        SponsorBlock.
                    </a>
                    Sponsor category preferences are stored in your cookies.
                </p>
            </div>
            {#each validCategories as category}
                <FormField
                    form={sponsorForm}
                    name="sponsor_{category}"
                    class="border-b border-border">
                    <FormControl let:attrs>
                        <div class="flex items-center justify-between gap-2">
                            <FormLabel class="flex items-center gap-2">
                                {formatCategoryName(category)}
                                <HoverCard.Root>
                                    <HoverCard.Trigger
                                        target="_blank"
                                        href={formatCategoryDescription(category).href}>
                                        <HelpCircle />
                                    </HoverCard.Trigger>
                                    <HoverCard.Content
                                        side="right"
                                        class="prose prose-neutral text-sm dark:prose-invert">
                                        {formatCategoryDescription(category).description}
                                    </HoverCard.Content>
                                </HoverCard.Root>
                            </FormLabel>
                            <Checkbox bind:checked={$sponsorFormData[`sponsor_${category}`]} />
                            <input
                                hidden
                                type="checkbox"
                                {...attrs}
                                bind:checked={$sponsorFormData[`sponsor_${category}`]} />
                        </div>
                    </FormControl>
                    <FormFieldErrors />
                </FormField>
            {/each}
        </div>
        <div class="flex justify-end gap-2">
            <FormButton variant="secondary" class="w-full">Save</FormButton>
        </div>
    </form>

    <div class="flex flex-col gap-1 py-4">
        <div class="mb-2 flex flex-col gap-0">
            <p class="text-xl font-semibold">Video player</p>
            <p class="text-sm text-muted-foreground">Automatically saves options to your browser</p>
        </div>

        <div class="flex flex-col gap-2">
            <div class="flex items-center justify-between">
                <Label for="autoplay">Autoplay</Label>
                <Switch bind:checked={$autoplay} id="autoplay" class="scale-90" />
            </div>
            <div class="flex items-center justify-between">
                <Label for="startMuted">Start muted</Label>
                <Switch bind:checked={$startMuted} id="startMuted" class="scale-90" />
            </div>
            <div class="flex items-center justify-between">
                <Label for="subtitles">Show subtitles</Label>
                <Switch bind:checked={$subtitles} id="subtitles" class="scale-90" />
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

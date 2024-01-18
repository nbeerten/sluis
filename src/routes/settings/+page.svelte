<script lang="ts">
    import * as Form from "$lib/components/ui/form";
    import { formSchema } from "./schema";

    export let data;

    const validCategories = [
        "sponsor",
        "intro",
        "outro",
        "preview",
        "interaction",
        "selfpromo",
        "music_offtopic",
        "poi_highlight",
        "filler",
    ] as const;
</script>

<main>
    <hgroup class="pb-2">
        <h1 class="text-3xl font-bold">Settings</h1>
    </hgroup>

    <Form.Root method="POST" form={data.form} schema={formSchema} let:config class="max-w-lg">
        <p class="text-lg font-semibold">Instance settings</p>
        <p class="prose prose-invert">See sidebar for instance selector and login option.</p>
        <div class="flex flex-col gap-1 py-4">
            <p class="text-lg font-semibold">Sponsorblock categories</p>
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
            <Form.Button>Save</Form.Button>
        </div>
    </Form.Root>
</main>

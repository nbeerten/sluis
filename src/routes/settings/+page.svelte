<script lang="ts">
    import * as Form from "$lib/components/ui/form";
    import { formSchema } from "./schema";
    import { outputObject } from "./schema";

    export let data;

    const validCategories = Object.entries(outputObject).map(([key, _]) =>
        key.slice("sponsor_".length)
    ) as (keyof typeof outputObject extends `sponsor_${infer T}` ? T : never)[];
</script>

<main>
    <hgroup class="pb-2">
        <h1 class="text-3xl font-bold">Settings</h1>
    </hgroup>

    <Form.Root method="POST" form={data.form} schema={formSchema} let:config class="max-w-lg">
        <div class="mb-2 flex flex-col gap-0">
            <p class="text-xl font-semibold">Instance settings</p>
            <p class="text-sm text-muted-foreground">
                See sidebar for instance selector and login option.
            </p>
        </div>
        <div class="flex flex-col gap-1 py-4">
            <div class="mb-2 flex flex-col gap-0">
                <p class="text-xl font-semibold">Sponsorblock Categories</p>
                <p class="text-sm text-muted-foreground">
                    Using <a href="https://sponsor.ajay.app/" target="_blank" class="underline">
                        SponsorBlock
                    </a>
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
            <Form.Button>Save</Form.Button>
        </div>
    </Form.Root>
</main>

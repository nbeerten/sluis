<script lang="ts">
    import { Select as SelectPrimitive } from "bits-ui";
    import ChevronDown from "~icons/lucide/chevron-down";
    import { cn } from "$lib/utils";

    type $$Props = SelectPrimitive.TriggerProps;
    type $$Events = SelectPrimitive.TriggerEvents;

    let className: $$Props["class"] = undefined;
    export { className as class };
</script>

<SelectPrimitive.Trigger
    class={cn(
        "flex h-10 w-full items-center justify-between rounded-md border border-input bg-transparent px-3 py-2 text-sm placeholder:text-muted-foreground focus:border-ring focus:outline-none disabled:cursor-not-allowed disabled:opacity-50",
        className
    )}
    {...$$restProps}
    let:builder
    on:click
    on:keydown>
    <slot {builder} />
    <div>
        <ChevronDown class="h-4 w-4 opacity-50" />
    </div>
</SelectPrimitive.Trigger>

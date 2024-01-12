<script lang="ts">
    let className: string | undefined;
    export { className as class };
    import { cn } from '$lib/utils';
</script>

<div class={cn('fixed left-0 top-0 h-full w-64 space-y-1 px-3 pt-20', className)}>
    <slot />
</div>

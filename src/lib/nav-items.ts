import type { SvelteComponent } from "svelte";
import type { SvelteHTMLElements } from "svelte/elements";
import BarChart3 from "~icons/lucide/bar-chart-3";
import LayoutGrid from "~icons/lucide/layout-grid";

type NavItem = {
    label: string;
    href: string;
    icon: typeof SvelteComponent<SvelteHTMLElements["svg"]>;
};

const navItems: NavItem[] = [
    {
        label: "Trending",
        href: "/",
        icon: BarChart3,
    },
    {
        label: "Feed",
        href: "/feed",
        icon: LayoutGrid,
    },
];

export default navItems;

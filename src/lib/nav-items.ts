import type { SvelteComponent } from "svelte";
import type { SvelteHTMLElements } from "svelte/elements";
import BarChart3 from "~icons/lucide/bar-chart-3";
import LayoutGrid from "~icons/lucide/layout-grid";
import Settings from "~icons/lucide/Settings";
import ListVideo from "~icons/lucide/list-video";

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
    {
        label: "Playlists",
        href: "/playlists",
        icon: ListVideo,
    },
    {
        label: "Settings",
        href: "/settings",
        icon: Settings,
    },
];

export default navItems;

import { persisted } from "svelte-persisted-store";

export const autoplay = persisted("autoplay", true);

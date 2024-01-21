import { persisted } from "svelte-persisted-store";

export const autoplay = persisted("autoplay", true);
export const startMuted = persisted("startMuted", false);
export const seekAmount = persisted("seekAmount", 10);
export const timeTillNext = persisted("timeTillNext", 0);
export const bareCards = persisted("bareCards", true);

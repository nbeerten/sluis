import { z } from "zod";

export const formSchema = z.object({
    sponsor_sponsor: z.boolean(),
    sponsor_intro: z.boolean(),
    sponsor_outro: z.boolean(),
    sponsor_preview: z.boolean(),
    sponsor_interaction: z.boolean(),
    sponsor_selfpromo: z.boolean(),
    sponsor_music_offtopic: z.boolean(),
    sponsor_poi_highlight: z.boolean(),
    sponsor_filler: z.boolean(),
});

export type FormSchema = typeof formSchema;

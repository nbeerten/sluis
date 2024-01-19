import { z } from "zod";

export const outputObject = {
    sponsor_sponsor: false,
    sponsor_intro: false,
    sponsor_outro: false,
    sponsor_preview: false,
    sponsor_interaction: false,
    sponsor_selfpromo: false,
    sponsor_music_offtopic: false,
    sponsor_filler: false,
};

export const sponsorSchema = z.object({
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

export const instanceSchema = z.object({
    instance: z.string().url(),
});

export type SponsorSchema = typeof sponsorSchema;
export type InstanceSchema = typeof instanceSchema;

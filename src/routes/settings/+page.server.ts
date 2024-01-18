import { fail } from "@sveltejs/kit";
import { superValidate } from "sveltekit-superforms/server";
import { formSchema } from "./schema";
import { cookiesExtract } from "$lib/cookiesExtract";

const outputObject = {
    sponsor_sponsor: false,
    sponsor_intro: false,
    sponsor_outro: false,
    sponsor_preview: false,
    sponsor_interaction: false,
    sponsor_selfpromo: false,
    sponsor_music_offtopic: false,
    sponsor_poi_highlight: false,
    sponsor_filler: false,
} as Record<string, boolean>;

export const load = async ({ cookies }) => {
    let { sponsorsettings } = cookiesExtract(cookies);
    if (!sponsorsettings) sponsorsettings = "";
    const sponsorCategories = structuredClone(outputObject);

    sponsorsettings.split(",").forEach((i) => {
        if (Object.hasOwn(sponsorCategories, i)) {
            sponsorCategories[i] = true;
        }
    });

    return {
        form: await superValidate(sponsorCategories, formSchema),
    };
};

export const actions = {
    default: async (event) => {
        const form = await superValidate(event, formSchema);
        if (!form.valid) {
            return fail(400, {
                form,
            });
        }

        const sponsorsettings = Object.entries(form.data)
            .filter((i) => i[0].startsWith("sponsor"))
            .map((i) => (i[1] ? i[0] : null))
            .filter((i) => i !== null) as string[];

        event.cookies.set("sponsorsettings", sponsorsettings.join(","), {
            path: "/",
            httpOnly: false,
            secure: false,
        });

        return {
            form,
        };
    },
};

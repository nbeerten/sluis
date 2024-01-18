import { fail } from "@sveltejs/kit";
import { superValidate } from "sveltekit-superforms/server";
import { formSchema } from "./schema";
import { cookiesExtract } from "$lib/cookiesExtract";
import { outputObject } from "./schema";

export const load = async ({ cookies }) => {
    let { sponsorsettings } = cookiesExtract(cookies);
    if (!sponsorsettings) sponsorsettings = "";
    const sponsorCategories = structuredClone(outputObject as Record<string, boolean>);

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

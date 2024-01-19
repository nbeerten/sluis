import { fail } from "@sveltejs/kit";
import { superValidate } from "sveltekit-superforms/server";
import { instanceSchema, sponsorSchema } from "./schema";
import { extract } from "$lib/cookies";
import { outputObject } from "./schema";

export const load = async ({ cookies, parent }) => {
    const {
        instance: { url: instance },
    } = await parent();
    let { sponsorsettings } = extract(cookies);
    if (!sponsorsettings) sponsorsettings = "";
    const sponsorCategories = structuredClone(outputObject as Record<string, boolean>);

    sponsorsettings.split(",").forEach((i) => {
        if (Object.hasOwn(sponsorCategories, i)) {
            sponsorCategories[i] = true;
        }
    });

    return {
        instanceForm: await superValidate({ instance: instance }, instanceSchema),
        sponsorForm: await superValidate(sponsorCategories, sponsorSchema),
    };
};

export const actions = {
    instance: async (event) => {
        const instanceForm = await superValidate(event, instanceSchema);
        if (!instanceForm.valid) {
            return fail(400, {
                instanceForm,
            });
        }

        event.cookies.set("instance", instanceForm.data.instance, {
            path: "/",
            httpOnly: false,
            secure: false,
        });
        event.cookies.set("authToken", "", { expires: new Date(0), path: "/" });

        return {
            instanceForm,
        };
    },

    sponsor: async (event) => {
        const sponsorForm = await superValidate(event, sponsorSchema);
        if (!sponsorForm.valid) {
            return fail(400, {
                sponsorForm,
            });
        }

        const sponsorsettings = Object.entries(sponsorForm.data)
            .filter((i) => i[0].startsWith("sponsor"))
            .map((i) => (i[1] ? i[0] : null))
            .filter((i) => i !== null) as string[];

        event.cookies.set("sponsorsettings", sponsorsettings.join(","), {
            path: "/",
            httpOnly: false,
            secure: false,
        });

        return {
            sponsorForm,
        };
    },
};

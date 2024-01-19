import { fail } from "@sveltejs/kit";
import { superValidate } from "sveltekit-superforms/server";
import { formSchema } from "./schema";
import { extract } from "$lib/cookies";
import { outputObject } from "./schema";

export const load = async ({ cookies, parent }) => {
    const {
        instance: { url: instance },
        instances,
    } = await parent();
    let { sponsorsettings } = extract(cookies, instances);
    if (!sponsorsettings) sponsorsettings = "";
    const sponsorCategories = structuredClone(outputObject as Record<string, boolean>);

    sponsorsettings.split(",").forEach((i) => {
        if (Object.hasOwn(sponsorCategories, i)) {
            sponsorCategories[i] = true;
        }
    });

    return {
        form: await superValidate({ ...sponsorCategories, instance }, formSchema),
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

        event.cookies.set("instance", form.data.instance, {
            path: "/",
            httpOnly: false,
            secure: false,
        });
        event.cookies.set("authToken", "", { expires: new Date(0), path: "/" });

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

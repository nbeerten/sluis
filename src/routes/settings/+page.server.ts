import { fail, redirect } from "@sveltejs/kit";
import { superValidate } from "sveltekit-superforms/server";
import { zod } from "sveltekit-superforms/adapters";
import { deleteAccountSchema, instanceSchema, sponsorSchema } from "./schema";
import { outputObject } from "./schema";

export const load = async ({ locals }) => {
    const sponsorCategories = structuredClone(outputObject as Record<string, boolean>);

    locals.sponsorsettings.split(",").forEach((i) => {
        if (Object.hasOwn(sponsorCategories, i)) {
            sponsorCategories[i] = true;
        }
    });

    return {
        instanceForm: await superValidate({ instance: locals.instance }, zod(instanceSchema)),
        sponsorForm: await superValidate(sponsorCategories, zod(sponsorSchema)),
        deleteAccountForm: await superValidate(zod(deleteAccountSchema)),
    };
};

export const actions = {
    instance: async (event) => {
        const instanceForm = await superValidate(event, zod(instanceSchema));
        if (!instanceForm.valid) {
            return fail(400, {
                instanceForm,
            });
        }

        event.cookies.set("instance", instanceForm.data.instance, {
            path: "/",
            httpOnly: false,
            secure: false,
            expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365),
        });
        event.cookies.set("authToken", "", { expires: new Date(0), path: "/" });

        return {
            instanceForm,
        };
    },

    sponsor: async (event) => {
        const sponsorForm = await superValidate(event, zod(sponsorSchema));
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
            expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365),
        });

        return {
            sponsorForm,
        };
    },

    deleteAccount: async (event) => {
        const deleteAccountForm = await superValidate(event, zod(deleteAccountSchema));
        if (!deleteAccountForm.valid) {
            return fail(400, {
                deleteAccountForm,
            });
        }

        const { password } = deleteAccountForm.data;

        const authToken = event.cookies.get("authToken");

        if (!authToken) {
            return fail(400, {
                deleteAccountForm,
                error: "You need to be logged in to delete your account.",
            });
        }

        const api = event.locals.createPipedApi(event.fetch);
        const { username } = await api.postUserDelete({ authToken, password });

        if (!username) {
            return fail(400, {
                deleteAccountForm,
                error: "Could not delete your account.",
            });
        }

        event.cookies.set("authToken", "", { expires: new Date(0), path: "/" });

        redirect(302, "/");
    },
};

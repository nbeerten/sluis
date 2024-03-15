import * as z from "zod";
import { fail, redirect } from "@sveltejs/kit";

const loginSchema = z
    .object({
        username: z.string().trim().min(1),
        password: z.string().min(1),
        confirmpassword: z.string().min(1),
    })
    .superRefine(({ confirmpassword, password }, ctx) => {
        if (confirmpassword !== password) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Passwords do not match",
            });
        }
    });

export const actions = {
    default: async ({ request, cookies, fetch, locals }) => {
        const data = await request.formData();

        const formData = {
            username: data.get("username") as string,
            password: data.get("password") as string,
            confirmpassword: data.get("confirmpassword") as string,
        };

        const parsed = loginSchema.safeParse(formData);

        if (!parsed.success) {
            return fail(400, {
                username: formData.username,
                error: parsed.error.errors.join(", "),
            });
        }

        const { username, password } = parsed.data;

        const api = locals.createPipedApi(fetch);
        const { token } = await api.postRegister({ username, password });

        if (!token) {
            return fail(400, { username, error: `Could not register.` });
        }

        cookies.set("authToken", token, {
            path: "/",
            httpOnly: false,
            expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365),
        }); // 1 year

        redirect(302, "/");
    },
};

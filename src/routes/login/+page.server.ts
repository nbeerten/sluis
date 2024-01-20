import * as z from "zod";
import { fail, redirect } from "@sveltejs/kit";

const loginSchema = z.object({
    username: z.string().trim().min(1),
    password: z.string(),
});

export const actions = {
    default: async ({ request, cookies, fetch, locals }) => {
        const data = await request.formData();

        const formData = {
            username: data.get("username") as string,
            password: data.get("password") as string,
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
        const { token } = await api.getAuthToken({ username, password });

        if (!token) {
            return fail(400, { username, error: "Invalid credentials" });
        }

        cookies.set("authToken", token, { path: "/", httpOnly: false });

        redirect(302, "/");
    },
};

import * as v from 'valibot';
import { PipedApi } from '$lib/api';
import { fail, redirect } from '@sveltejs/kit';

const validator = v.object({
    username: v.string([v.toTrimmed()]),
    password: v.string()
});

export const actions = {
    default: async ({ request, cookies }) => {
        const data = await request.formData();
        const formData = {
            username: data.get('username') as string,
            password: data.get('password') as string
        };
        const parsed = await v.safeParseAsync(validator, formData);

        if (!parsed.success) {
            return fail(400, { username: formData.username, error: parsed.issues.join(', ') });
        }

        const { username, password } = parsed.output as { username: string; password: string };
        console.log(username, password);

        const api = PipedApi();
        const { token } = await api.getAuthToken({ username, password });

        cookies.set('authToken', token, { path: '/', httpOnly: false });

        redirect(302, '/');
    }
};

import { redirect } from '@sveltejs/kit';

export function GET({ cookies }) {
    cookies.set('authToken', '', { expires: new Date(0), path: '/' });
    return redirect(302, '/login');
}

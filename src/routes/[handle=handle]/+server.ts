import { redirect } from "@sveltejs/kit";

export async function GET({ params, fetch, locals }) {
    const api = locals.createPipedApi(fetch);
    const { id } = await api.getChannelFromHandle({ handle: params.handle.slice(1) });
    return redirect(307, `/channel/${id}`);
}

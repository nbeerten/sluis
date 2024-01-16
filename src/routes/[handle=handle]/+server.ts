import { PipedApi } from "$lib/api";
import { redirect } from "@sveltejs/kit";

export async function GET({ params, cookies, fetch }) {
    const instance = cookies.get("instance");
    const api = PipedApi(fetch, instance);
    const { id } = await api.getChannelFromHandle({ handle: params.handle.slice(1) });
    return redirect(307, `/channel/${id}`);
}

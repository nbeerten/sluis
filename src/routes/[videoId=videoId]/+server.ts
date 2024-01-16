import { redirect } from "@sveltejs/kit";

export async function GET({ params }) {
    return redirect(307, `/watch?v=${params.videoId}`);
}

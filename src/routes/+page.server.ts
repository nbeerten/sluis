import { error } from "@sveltejs/kit";

export const actions = {
    switchInstance: async ({ cookies, request, locals }) => {
        const data = await request.formData();
        const cookiesInstance = locals.instance;
        const instance = data.get("instance")?.toString();
        if (!instance) {
            return {
                success: false,
            };
        }
        if (cookiesInstance === instance) {
            return {
                success: true,
            };
        }

        cookies.set("instance", instance, { path: "/", httpOnly: false });
        cookies.set("authToken", "", { expires: new Date(0), path: "/" });

        return {
            success: true,
        };
    },
};

export const load = async ({ fetch, request, locals }) => {
    try {
        let country = request.headers.get("CF-IPCountry") as string | "XX" | "T1" | null; // ISO-3166-1 alpha-2 or XX is unknown or T1 if Tor.
        if (country === "XX" || country === "T1") {
            country = "US";
        } else if (country?.length !== 2) {
            country = "US";
        }

        return {
            videos: await locals.createPipedApi(fetch).getTrending({ region: country }),
            country,
        };
    } catch (err: unknown) {
        return error(500, {
            message: `${(err as Error).name}: ${(err as Error).message}`,
            stack: (err as Error).stack,
        });
    }
};

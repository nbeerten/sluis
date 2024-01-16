import { PipedApi } from "$lib/api";

export const actions = {
    switchInstance: async ({ cookies, request }) => {
        const data = await request.formData();
        const cookiesInstance = cookies.get("instance");
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

export const load = async ({ fetch, cookies, request }) => {
    const instance = cookies.get("instance");

    let country = request.headers.get("CF-IPCountry") as string | "XX" | "T1" | null; // ISO-3166-1 alpha-2 or XX is unknown or T1 if Tor.
    if (country === "XX" || country === "T1") {
        country = "US";
    } else if (country?.length !== 2) {
        country = "US";
    }

    return {
        videos: await PipedApi(fetch, instance).getTrending({ region: country }),
        country,
    };
};

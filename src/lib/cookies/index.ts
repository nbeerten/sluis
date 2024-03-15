import type { Cookies } from "@sveltejs/kit";
import { PipedApi, defaultInstance, type Instances } from "$lib/api";
import { cachedInstances } from "$lib/api/instances";

export async function extract(
    cookies: Cookies,
    fetch = globalThis.fetch,
    instances: Instances | undefined = undefined
) {
    const allCookies = Object.freeze(cookies.getAll());

    const authToken = () => allCookies.find((c) => c.name === "authToken")?.value || false;

    const getInstance = async () => {
        const cookieInstance =
            allCookies.find((c) => c.name === "instance")?.value || defaultInstance;

        instances ||= await cachedInstances(fetch);

        if (!instances) {
            throw new Error(
                "Instances API (https://piped-instances.kavin.rocks/) is not available. Please try again later."
            );
        }

        if (instances && instances.some((i) => i.api_url === cookieInstance)) {
            return cookieInstance;
        } else {
            throw new Error(
                "Currently selected instance is offline. Please select another instance. <br><b>If you can't, delete your cookies and try again.</b>"
            );
        }
    };
    const instance = await getInstance();

    const sponsorsettings = () => allCookies.find((c) => c.name === "sponsorsettings")?.value || "";

    return {
        get authToken() {
            return authToken();
        },
        get instance() {
            return instance;
        },
        get sponsorsettings() {
            return sponsorsettings();
        },
        get createPipedApi() {
            return (fetch = globalThis.fetch) => PipedApi(fetch, this.instance);
        },
    };
}

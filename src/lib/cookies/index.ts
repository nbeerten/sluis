import type { Cookies } from "@sveltejs/kit";
import { PipedApi, defaultInstance, type Instances } from "$lib/api";

export function extract(cookies: Cookies, instances?: Instances) {
    const allCookies = Object.freeze(cookies.getAll());

    const authToken = () => allCookies.find((c) => c.name === "authToken")?.value || false;

    const instance = () => {
        const cookieInstance =
            allCookies.find((c) => c.name === "instance")?.value || defaultInstance;

        if (!instances) {
            return cookieInstance;
        }

        if (instances && instances.some((i) => i.api_url === cookieInstance)) {
            return cookieInstance;
        } else {
            return defaultInstance;
        }
    };

    const sponsorsettings = () => allCookies.find((c) => c.name === "sponsorsettings")?.value || "";

    return {
        get authToken() {
            return authToken();
        },
        get instance() {
            return instance();
        },
        get sponsorsettings() {
            return sponsorsettings();
        },
        get createPipedApi() {
            return (fetch = globalThis.fetch) => PipedApi(fetch, this.instance);
        },
    };
}

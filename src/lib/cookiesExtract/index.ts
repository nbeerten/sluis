import type { Cookies } from "@sveltejs/kit";
import { PipedApi, defaultInstance } from "$lib/api";

export function cookiesExtract(cookies: Cookies) {
    const allCookies = cookies.getAll();
    const authToken = () => allCookies.find((c) => c.name === "authToken")?.value || false;
    const instance = () => allCookies.find((c) => c.name === "instance")?.value || defaultInstance;
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
            return (fetch = globalThis.fetch) => PipedApi(fetch, instance());
        },
    };
}

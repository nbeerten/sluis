import { dev } from "$app/environment";

const instanceCache: { age: number; data?: Instances } = { age: 0 };

export async function cachedInstances(fetch = globalThis.fetch) {
    try {
        const request = new Request("https://piped-instances.kavin.rocks/", {
            cf: {
                cacheTtl: 60 * 60 * 24,
            },
        });

        if (instanceCache.data && Date.now() - instanceCache.age < 60 * 60 * 24) {
            return instanceCache.data;
        } else if (instanceCache.data && Date.now() - instanceCache.age > 60 * 60 * 24) {
            delete instanceCache.data;
        }

        if (dev) {
            // eslint-disable-next-line no-console
            console.warn("Not using cached instances");
        }

        const data = (await fetch(request).then((r) => r.json())) as Instances;

        instanceCache.age = Date.now();
        instanceCache.data = data;

        return data;
    } catch (e) {
        // eslint-disable-next-line no-console
        console.error(e);

        return import("./backup.json", { assert: { type: "json" } }).then(
            (r) => r.default
        ) as Promise<Instances>;
    }
}

export type Instances = Array<{
    name: string;
    api_url: string;
    locations: string;
    version: string;
    up_to_date: boolean;
    cdn: boolean;
    registered: number;
    last_checked: number;
    cache: boolean;
    s3_enabled: boolean;
    image_proxy_url: string;
    registration_disabled: boolean;
    uptime_24h: number;
    uptime_7d: number;
    uptime_30d: number;
}>;

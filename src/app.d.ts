import { Instances } from "$lib/api";
import type { subscriptions } from "$lib/api/types";
import { extract } from "$lib/cookies";
import "unplugin-icons/types/svelte";

type Writeable<T> = { -readonly [P in keyof T]: T[P] };

// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
    namespace App {
        interface Error {
            message: string;
            stack?: string;
        }
        interface Locals extends Writeable<ReturnType<typeof extract>> {}
        interface PageData {
            instances: Instances;
            subscriptions: false | subscriptions;
            loggedIn: boolean;
            seo: import("./lib/components/seo").SeoProps;
            instance: { url: string } & Instances[number];
        }
        // interface PageState {}
        // interface Platform {}
    }
}

export {};

import { Instances } from '$lib/api';
import type { subscriptions } from '$lib/api/types';
import 'unplugin-icons/types/svelte';
// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
    namespace App {
        // interface Error {}
        // interface Locals {}
        interface PageData {
            instanceList: Instances;
            subscriptions: false | subscriptions;
            loggedIn: boolean;
        }
        // interface PageState {}
        // interface Platform {}
    }
}

export {};

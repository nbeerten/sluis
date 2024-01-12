import { persisted } from 'svelte-persisted-store';

export const preferences = persisted<{
    instance: string;
    authToken: string | null;
}>(
    'preferences',
    {
        instance: 'https://pipedapi.kavin.rocks',
        authToken: null
    },
    { storage: 'local', syncTabs: true }
);

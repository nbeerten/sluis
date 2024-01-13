import type {
    streams_videoId,
    trending,
    channel_channelId,
    search,
    subscriptions,
    feed
} from './types';

export const defaultInstance = 'https://pipedapi.smnz.de';

export function PipedApi(fetch = globalThis.fetch, baseUrl = defaultInstance) {
    return {
        getStream: ({ videoId }: { videoId: string }) => {
            return fetch(`${baseUrl}/streams/${videoId}`, {}).then((r) =>
                r.json()
            ) as Promise<streams_videoId>;
        },

        getTrending: ({ region }: { region: string }) => {
            return fetch(`${baseUrl}/trending?region=${encodeURIComponent(region)}`).then((r) =>
                r.json()
            ) as Promise<trending>;
        },

        getChannel: ({ channelId, nextpage }: { channelId: string; nextpage?: string }) => {
            const response = nextpage
                ? (fetch(
                      `${baseUrl}/nextpage/channel/${channelId}?nextpage=${encodeURIComponent(
                          nextpage
                      )}`
                  ).then((r) => r.json()) as Promise<channel_channelId>)
                : (fetch(`${baseUrl}/channel/${channelId}`, {}).then((r) =>
                      r.json()
                  ) as Promise<channel_channelId>);

            return response;
        },

        getSearch: ({
            query,
            filter = 'all',
            nextpage
        }: {
            query: string;
            filter?: string;
            nextpage?: string;
        }) => {
            const response = nextpage
                ? (fetch(
                      `${baseUrl}/nextpage/search?q=${query}&filter=${filter}&nextpage=${encodeURIComponent(
                          nextpage
                      )}`
                  ).then((r) => r.json()) as Promise<search>)
                : (fetch(
                      `${baseUrl}/search?q=${encodeURIComponent(query)}&filter=${encodeURIComponent(
                          filter
                      )}`,
                      {}
                  ).then((r) => r.json()) as Promise<search>);
            return response;
        },

        getAuthToken: ({ username, password }: { username: string; password: string }) => {
            return fetch(`${baseUrl}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password }),
                cache: 'no-store'
            }).then((r) => r.json()) as Promise<{ token: string }>;
        },

        getFeed: ({ authToken }: { authToken: string }) => {
            return fetch(`${baseUrl}/feed?authToken=${encodeURIComponent(authToken)}`, {}).then(
                (r) => r.json()
            ) as Promise<feed>;
        },

        // getUserPlaylists: ({ authToken }: { authToken: string }) => {
        // 	return fetch(`${baseUrl}/user/playlists`, {
        // 		headers: { Authorization: authToken },
        // 		cache: 'no-store'
        // 	}).then((r) => r.json()) as Promise<UserPlaylists>;
        // },

        getSubscriptions: ({ authToken }: { authToken: string }) => {
            return fetch(`${baseUrl}/subscriptions`, {
                headers: { Authorization: authToken },
                cache: 'no-store'
            }).then((r) => r.json()) as Promise<subscriptions>;
        },

        getSubscribed: ({ authToken, channelId }: { authToken: string; channelId: string }) => {
            return fetch(`${baseUrl}/subscribed?channelId=${encodeURIComponent(channelId)}`, {
                headers: { Authorization: authToken }
            }).then((r) => r.json()) as Promise<{ subscribed: boolean }>;
        },

        postSubscribe: ({ authToken, channelId }: { authToken: string; channelId: string }) => {
            return fetch(`${baseUrl}/subscribe`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: authToken
                },
                body: JSON.stringify({ channelId })
            });
        },

        postUnsubscribe: ({ authToken, channelId }: { authToken: string; channelId: string }) => {
            return fetch(`${baseUrl}/unsubscribe`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: authToken
                },
                body: JSON.stringify({ channelId })
            });
        }
    };
}

export async function getInstances() {
    return fetch('https://piped-instances.kavin.rocks/').then((r) =>
        r.json()
    ) as Promise<Instances>;
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

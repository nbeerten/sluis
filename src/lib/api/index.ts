import type {
    streams_videoId,
    trending,
    channel_channelId,
    search,
    subscriptions,
    feed,
    channels_tabs,
    user_playlists,
    sponsors_videoId,
    comments_videoId,
} from "./types";
import { browser } from "$app/environment";

export const defaultInstance = "https://pipedapi.smnz.de";

export function PipedApi(fetchFunc = globalThis.fetch, baseUrl = defaultInstance, timeout = 5000) {
    const UserAgent = browser ? navigator.userAgent : "Sluis/(https://github.com/nbeerten/sluis)";

    const fetch = async (url: RequestInfo | URL, init?: RequestInit) =>
        fetchFunc(url, {
            ...init,
            headers: { ...init?.headers, "User-Agent": UserAgent },
            signal: AbortSignal.timeout(timeout),
        });

    return {
        getStream: ({ videoId }: { videoId: string }) => {
            return fetch(`${baseUrl}/streams/${videoId}`).then((r) =>
                r.json()
            ) as Promise<streams_videoId>;
        },

        getSponsors: ({ videoId, categories }: { videoId: string; categories: string[] }) => {
            return fetch(
                `${baseUrl}/sponsors/${videoId}?category=[${encodeURIComponent(
                    categories.map((c) => `"${c}"`).join(",")
                )}]`
            ).then((r) => r.json()) as Promise<sponsors_videoId>;
        },

        getComments: ({ videoId, nextpage }: { videoId: string; nextpage?: string }) => {
            const response = nextpage
                ? (fetch(
                      `${baseUrl}/nextpage/comments/${videoId}?nextpage=${encodeURIComponent(
                          nextpage
                      )}`
                  ).then((r) => r.json()) as Promise<comments_videoId>)
                : (fetch(`${baseUrl}/comments/${videoId}`).then((r) =>
                      r.json()
                  ) as Promise<comments_videoId>);

            return response;
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
                : (fetch(`${baseUrl}/channel/${channelId}`).then((r) =>
                      r.json()
                  ) as Promise<channel_channelId>);

            return response;
        },

        getChannelFromHandle: ({ handle }: { handle: string }) => {
            const response = fetch(`${baseUrl}/@/${handle}`).then((r) =>
                r.json()
            ) as Promise<channel_channelId>;

            return response;
        },

        getChannelTab: ({ data, nextpage }: { data: string; nextpage?: string }) => {
            let requestUrl = `${baseUrl}/channels/tabs?data=${encodeURIComponent(data)}`;
            if (nextpage) {
                requestUrl += `&nextpage=${encodeURIComponent(nextpage)}`;
            }
            return fetch(requestUrl).then((r) => r.json()) as Promise<channels_tabs>;
        },

        getSearch: ({
            query,
            filter = "all",
            nextpage,
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
                      )}`
                  ).then((r) => r.json()) as Promise<search>);
            return response;
        },

        getAuthToken: ({ username, password }: { username: string; password: string }) => {
            return fetch(`${baseUrl}/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ username, password }),
            }).then((r) => r.json()) as Promise<{ token: string }>;
        },

        getFeed: ({ authToken }: { authToken: string }) => {
            return fetch(`${baseUrl}/feed?authToken=${encodeURIComponent(authToken)}`, {}).then(
                (r) => r.json()
            ) as Promise<feed>;
        },

        getUserPlaylists: ({ authToken }: { authToken: string }) => {
            return fetch(`${baseUrl}/user/playlists`, {
                headers: { Authorization: authToken },
            }).then((r) => r.json()) as Promise<user_playlists>;
        },

        getSubscriptions: ({ authToken }: { authToken: string }) => {
            return fetch(`${baseUrl}/subscriptions`, {
                headers: { Authorization: authToken },
            }).then((r) => r.json()) as Promise<subscriptions>;
        },

        getSubscribed: ({ authToken, channelId }: { authToken: string; channelId: string }) => {
            return fetch(`${baseUrl}/subscribed?channelId=${encodeURIComponent(channelId)}`, {
                headers: { Authorization: authToken },
            }).then((r) => r.json()) as Promise<{ subscribed: boolean }>;
        },

        postSubscribe: ({ authToken, channelId }: { authToken: string; channelId: string }) => {
            return fetch(`${baseUrl}/subscribe`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: authToken,
                },
                body: JSON.stringify({ channelId }),
            });
        },

        postUnsubscribe: ({ authToken, channelId }: { authToken: string; channelId: string }) => {
            return fetch(`${baseUrl}/unsubscribe`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: authToken,
                },
                body: JSON.stringify({ channelId }),
            });
        },
    };
}

export async function getInstances() {
    return fetch("https://piped-instances.kavin.rocks/").then((r) =>
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

import { extract } from "$lib/cookies";

export async function handle({ event, resolve }) {
    const extracted = await extract(event.cookies, event.fetch);

    event.locals = extracted;

    const response = await resolve(event);

    response.headers.set(
        "Content-Security-Policy",
        `default-src 'self' data:; script-src 'self' data: 'unsafe-inline'; style-src 'self' data: 'unsafe-inline' 'unsafe-hashes'; img-src *; media-src * blob:; connect-src *;`
    );

    return response;
}

export const handleError = async ({ error, status, message }) => {
    // eslint-disable-next-line no-console
    console.error(error);

    return {
        status: status || 500,
        message: (error as App.Error).message || message,
    };
};

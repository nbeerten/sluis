import { extract } from "$lib/cookies";

export async function handle({ event, resolve }) {
    const extracted = await extract(event.cookies, event.fetch);

    event.locals = extracted;

    return resolve(event);
}

export const handleError = async ({ error, status, message }) => {
    // eslint-disable-next-line no-console
    console.error(error);

    return {
        status: status || 500,
        message: (error as App.Error).message || message,
    };
};

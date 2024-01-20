import { extract } from "$lib/cookies";

export async function handle({ event, resolve }) {
    const extracted = extract(event.cookies, event.fetch);

    event.locals = extracted;

    return await resolve(event);
}

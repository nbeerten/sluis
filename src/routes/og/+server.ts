// import { ImageResponse } from "@cloudflare/pages-plugin-vercel-og/api";
// import { dev } from "$app/environment";
// import { Parser as HtmlToReactParser } from "html-to-react";

// export const GET = async ({ fetch }) => {
//     const templates = {
//         default: () => {
//             const static_preview_image = `https://i.imgur.com/looPYCV.png`;
//             return `<div tw="w-1200 h-630 bg-black text-white flex flex-col p-16">
//                 <div tw="flex flex-col gap-0">
//                     <p tw="text-[#ffe7b3] text-7xl font-bold m-0" style="font-family: 'Inter ExtraBold'">Sluis</p>
//                     <p tw="m-0 text-[#a3a3a3] text-xl" style="font-family: 'Inter Medium'">A new, desktop-optimised frontend for Piped</p>
//                 </div>
//                 <div tw="flex mt-8">
//                     <img tw="w-300 aspect-[16/9] rounded-2xl" src="${static_preview_image}" />
//                 </div>
//             </div>`;
//         },
//     };

//     const htmlInput = templates.default();

//     // @ts-expect-error types are not properly made
//     const htmlToReactParser = new HtmlToReactParser() as { parse: (html: string) => object };
//     const reactElement = htmlToReactParser.parse(htmlInput);
//     return new ImageResponse(reactElement, {
//         width: 1200,
//         height: 630,
//         fonts: [
//             {
//                 name: "Inter ExtraBold",
//                 data: await fetch("Inter-ExtraBold.ttf").then((res) => res.arrayBuffer()),
//                 style: "normal",
//             },
//             {
//                 name: "Inter Medium",
//                 data: await fetch("Inter-Medium.ttf").then((res) => res.arrayBuffer()),
//                 style: "normal",
//             },
//         ],
//         headers: {
//             "Cache-Control": dev ? "no-cache" : "public, max-age=31536000",
//             "Content-Type": "image/png",
//         },
//     }) as Response & ImageResponse;
// };

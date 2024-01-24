declare module "custom-video-element" {
    export = class CustomVideoElement extends HTMLVideoElement {
        nativeEl: HTMLVideoElement;
        constructor();
    };
}

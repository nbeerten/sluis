<!-- <script lang="ts">
    /** eslint-disable no-console */
    import shaka, { type Player } from "shaka-player";
    import { createEventDispatcher, onMount } from "svelte";
    import "shaka-player/dist/controls.css";

    interface Subtitle {
        kind?: 'subtitles' | 'captions';
        src: string;
        srclang: string;
        label: string;
    }

    const dispatch = createEventDispatcher();

    let playerEl: HTMLDivElement,
        playerInstance: Player,
        className = "",
        videoEl: HTMLVideoElement;
    export { className as class };
    export let src: string,
        preload = "auto",
        disablepictureinpicture = false,
        controlslist = "",
        crossorigin: "anonymous" | "use-credentials" | "" = "",
        subtitles: Subtitle[] = [],
        configuration: object;

    let qualities: { label: string; value: number | null }[] = [];
    let quality: number | null = null;

    let isOnline = true;
    let isLoaded = false;

    const updateOnlineStatus = () => (isOnline = window.navigator.onLine);
    const addNetworkListeners = () => updateOnlineStatus();

    const initShaka = () => {
        shaka.polyfill.installAll();

        if (!shaka.Player.isBrowserSupported()) {
            alert("Video player: Browser is not supported!");
            return;
        }

        addNetworkListeners();
    };

    const trackVariants: shaka.extern.Track[] = [];

    const initShakaInstance = async () => {
        playerInstance = new shaka.Player(videoEl);
        playerInstance.configure(configuration);

        playerInstance.getNetworkingEngine()?.registerRequestFilter((type, request) => {
            dispatch("requestHeader", { type, request, shaka });
        });

        playerInstance.addEventListener("trackschanged", () => {
            playerInstance.getVariantTracks().forEach((track) => {
                trackVariants.push(track);
                qualities = trackVariants.map((track) => {
                    return {
                        label: `${track.height}p`,
                        value: track.id,
                    };
                });

                qualities.unshift({ label: "Auto", value: null });
            });
        });

        playerInstance.addEventListener("error", console.error);
        // playerInstance.addEventListener(
        //     "buffering",
        //     (event: any) => ($isBuffering = event.buffering)
        // );

        try {
            await playerInstance.load(src);
        } catch (error) {
            console.log(error);
        }
    };

    const handleQuality = (event: CustomEvent) => {
        const selectedVariantId =
            !event.detail.data && typeof event.detail.data !== "number" ? null : +event.detail.data;
        const selectedVariant = trackVariants.find(
            (track) => track.id === selectedVariantId
        ) as shaka.extern.Track;

        if (selectedVariant) {
            const variant = trackVariants.find((track) => track.id === selectedVariant.id);

            if (variant) {
                const selectedQuality = qualities.find((quality) => quality.value === variant.id);
                if (selectedQuality) quality = selectedQuality.value as number;

                playerInstance.configure({ abr: { enabled: false } });
                playerInstance.selectVariantTrack(variant, true);
            } else {
                console.error(`Couldn't set quality`);
            }
        } else {
            quality = null;
            playerInstance.configure({ abr: { enabled: true } });
        }
    };

    const initPlayer = async () => {
        initShaka();
        await initShakaInstance();
        isLoaded = true;
    };

    onMount(async () => {
        await import("shaka-player/dist/shaka-player.ui");
        isOnline = window.navigator.onLine;
        initPlayer();
    });
</script> -->
<!-- 
<div data-shaka-player-container style="max-width:40em"
         data-shaka-player-cast-receiver-id="07AEE832"> -->
<!-- svelte-ignore a11y-media-has-caption -->
    <!-- <video
        style="width:100%;height:100%"
        autoplay
        id="video"
        data-shaka-player 
        {preload}
        {disablepictureinpicture}
        {crossorigin}
        bind:this={videoEl}>
        {#each subtitles as subtitle}
            <track
                label={subtitle.label}
                kind={subtitle.kind ?? "captions"}
                srclang={subtitle.srclang}
                src={subtitle.src} />
        {/each}
    </video> -->
<!-- </div> -->

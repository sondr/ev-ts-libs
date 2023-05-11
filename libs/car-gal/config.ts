import { Config, fullscreenOptions, CarouselOptions } from './interfaces';
import { findElement, deepObjectAssign } from './dom/utils';

//export async function Configure(userConfig?: Config): Promise<Config> {
export function Configure(userConfig?: Config): Config {

    // let configEvents: ConfigEvents = {
    //     onLoaded: () => { return <IGallery>[] }
    // };

    let cfg: Config = {
        //window: window!,
        autoInit: true,
        Events: {},
        defaultOptions: {
            lazyLoad: true,
            enableFullScreen: true,
            Carousel: {
                autoplay: true,
                autoplayRepeat: true,
                backgroundColor: '#FFFFFF',
                //opacity: undefined,
                slideInterval: 10000,
                thumbnails: true,
                Events: {},
                btns: {},
            },
            Fullscreen: {
                //menuBarFixed: true,
                Events:{},
                closeOnClick: true,
                opacity: 0.95,
                Menubar: {
                    fixed: true,
                    indicator: true
                },
                title: {},
                description: {},
                Carousel: {
                    autoplay: false,
                    autoplayRepeat: false,
                    //padding: '40px 0',
                    padding: '0 0',
                    //backgroundColor: '#222',
                    slideInterval: 10000,
                    thumbnails: true,
                    Events: {},
                    btns: {}
                },
                btns: {}
            }
        },
        instances: []
    };

    cfg = deepObjectAssign({ target: {}, sources: [cfg, userConfig || {}] }); //, skipKeys:['Events'] });
    if (window && !cfg.window) cfg.window = window;

    //cfg.document = await ready(cfg.document);
    if (!cfg.document) cfg.document = document;

    if (cfg.rootElement && typeof cfg.rootElement === 'string')
        cfg.rootElement = findElement(cfg.document, cfg.rootElement);
    if (!cfg.containerElement) cfg.containerElement = cfg.document.body;

    return cfg;
};
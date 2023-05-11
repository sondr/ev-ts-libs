import { Config } from "../interfaces";

const testConfig: Config = {
    window: Window,
    document: document,
    instances: [{
        container: '#test',
        options: {
            Carousel: {
                autoplay: false,
                btns: {
                    //color: '#ed1c24',
                    hover: '#ed1c24',
                    background: '#ed1c24',
                    backgroundHover: '#fff'
                }
            },
            Fullscreen: {
                background: '#eee',
                color: '#000',
                Menubar: {
                    fixed: false,
                    background: 'rgba(255,255,255,0.5)'
                },
                Carousel: {
                    btns: {
                        color: '#ed1c24',
                        hover: '#fff',
                        background: '#fff',
                        backgroundHover: '#ed1c24'
                    }
                }
            }
        }
    }, {
        container: '#test2',
        options: {
            Carousel: {
                autoplay: false
            },
            Fullscreen: {
                background: '#fff',
                //color: '#000'
            }
        }
    }],defaultOptions:{
    }
};
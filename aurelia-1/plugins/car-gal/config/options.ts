import { Options } from '../../../../libs/car-gal/interfaces';

export const cargalDefaultOpts: Options = {
    //container: `#${id}`,
    //options: {
    Carousel: {
      autoplay: true,
      btns: {
        color: '#ed1c24',
        hover: '#fff',
        background: 'rgba(255,255,255,0.5)',
        backgroundHover: '#ed1c24'
      }
    },
    Fullscreen: {
      background: '#fff',
      color: '#000',
      Menubar: {
        background: 'rgba(255,255,255,0.5)'
      },
      Carousel: {
        btns: {
          color: '#ed1c24',
          hover: '#fff',
          background: 'rgba(255,255,255,0.5)',
          backgroundHover: '#ed1c24'
        }
      }
    }
    //}
  };
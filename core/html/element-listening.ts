export function removeEventListeners(el?: HTMLElement, events?: IElementTogglerListener[]) {
    if (el && events?.length) {
      events.forEach(e => {
        el?.removeEventListener(e.key, e.event, e.options);
      });
    }
  }
  export function addEventListeners(el?: HTMLElement, events?: IElementTogglerListener[]) {
    if (el && events?.length) {
      events.forEach(e => el.addEventListener(e.key, e.event, e.options));
    }
  }

  export interface IElementTogglerListener {
    key: string;
    event: <K extends keyof HTMLElementEventMap>(ev: HTMLElementEventMap[K]) => any;
    options?: boolean | AddEventListenerOptions;
  }
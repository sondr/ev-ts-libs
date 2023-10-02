import { viewEngineHooks } from 'aurelia-framework';

const toElementAttr = 'to-element';

export interface IAsElementViewHookTags {
  from: string;
  to: string;
}


@viewEngineHooks()
export class AsElementViewHook {
  static tags: IAsElementViewHookTags[] = [];

  beforeCompile(template: DocumentFragment) {
    for (const t of AsElementViewHook.tags) {

      const elements = template.querySelectorAll<HTMLElement>(t.from);
      for (const el of Array.from(elements)) {
        let toElement = el.attributes.getNamedItem(toElementAttr)?.value;
        if (toElement) {
          el.attributes.removeNamedItem(toElementAttr);
        }
        else {
          toElement = t.to;
        }

        const next = document.createElement(toElement);

        // Grab all of the original's attributes, and pass them to the replacement
        for (let i = 0, l = el.attributes.length; i < l; ++i) {
          const nodeName = el.attributes.item(i)!.nodeName;
          const nodeValue = el.attributes.item(i)!.nodeValue;
          next.setAttribute(nodeName, nodeValue!);
        }
        next.setAttribute('as-element', t.from);

        // Persist contents
        next.innerHTML = el.innerHTML;

        // Switch!
        el.parentNode!.replaceChild(next, el);
      }

    }
  }
}

import { Media, ICgElement } from '../interfaces';
import { _CLASSNAMES, _EVENT_ACTIONS, _TYPES, _HTML } from '../constants';
import { CgElement, convertToMediaObjects, deepObjectAssign, findElement } from '../dom/utils';
//import { MenuBar } from './../dom/menu-bar';
import { Carousel } from './carousel';
import { _PLATFORM } from '../platform';
import { IGallery, Options, IMedia } from '../interfaces';

export class Fullscreen {
    private readonly gallery: IGallery;
    private readonly images: IMedia[];
    private readonly carousel: Carousel;
    private readonly menubar: CgElement;
    private element?: CgElement;
    private carouselContainer?: CgElement;
    private options: Options;

    private titleElement?: CgElement;
    private indicator?: CgElement;

    private overlayStyleClass?: string;

    constructor(gallery: IGallery) {
        this.gallery = gallery;

        // let opts = JSON.parse(JSON.stringify(this.gallery.options!)) as Options;
        // opts.Carousel = deepObjectAssign({ target: {}, sources: [opts.Fullscreen!.Carousel!] });

        this.options = { Carousel: gallery.options!.Fullscreen!.Carousel, Fullscreen: gallery.options!.Fullscreen };
        this.menubar = this.createMenuBar();
        this.createContainerElements();

        this.images = this.gallery.media.concat(this.gallery.externalMedia).map(media => {
            return <IMedia>{
                ...media,
                element: undefined,
                containerElement: media.containerElement.cloneNode(true)
            };
        });

        this.carousel = new Carousel(<IGallery>{
            media: this.images,
            container: this.element!.Element,
            options: this.options
        }, this);

        if (this.options.Fullscreen!.background)
            this.overlayStyleClass = _PLATFORM.styleSheet.appendStyle({ values: [['background', this.options.Fullscreen!.background!]] });
    }

    public get Carousel() {
        return this.carousel;
    }

    public get Media() {
        return this.images;
    }

    createContainerElements() {
        this.carouselContainer = new CgElement({ classes: _CLASSNAMES.carousel });
        this.element = new CgElement({
            classes: `${_CLASSNAMES.fullscreenContainer} ${this.options.Carousel!.thumbnails ? _CLASSNAMES.thumbsActive : ''}`
        });
        this.element.appendChild(this.menubar);
        this.element.appendChild(this.carouselContainer);
    }

    show(index: number) {
        if(this.options.Fullscreen!.Events!.onShow) this.options.Fullscreen!.Events!.onShow();
        this.setMenubarFixed(this.gallery.options!.Fullscreen!.Menubar!.fixed!);
        _PLATFORM.overlay.show(this.element!.Element, this.overlayStyleClass);
        if (typeof index === _TYPES.number) this.carousel.set_active(index);
    }

    close(){
        if(this.options.Fullscreen!.Events!.onClose) this.options.Fullscreen!.Events!.onClose();
        _PLATFORM.overlay.close();
    }

    dispose() {
        this.carousel.dispose();
        this.menubar.dispose();
        this.element!.dispose();
    }

    setThumbnailsActiveState(value?: boolean) {
        let thumbnails = this.carousel.Thumbnails!;
        // if(typeof value === _TYPES.boolean)
        thumbnails.toggle();
        if (thumbnails.isActive)
            this.element!.Element.classList.add(_CLASSNAMES.thumbsActive);
        else
            this.element!.Element.classList.remove(_CLASSNAMES.thumbsActive);
    }

    createMenuBar() {
        this.titleElement = new CgElement({
            tagName: _HTML.Tags.p,
            classes: _CLASSNAMES.fullscreenMenuBarTitle, textContent: '',
            styles: this.options.Fullscreen!.color ? { values: [['color', this.options.Fullscreen!.color!]] } : undefined
        });
        this.indicator = new CgElement({
            tagName: _HTML.Tags.div,
            classes: _CLASSNAMES.fullscreenMenuBarIndicator, textContent: '',
            styles: this.options.Fullscreen!.color ? { values: [['color', this.options.Fullscreen!.color!]] } : undefined
        });
        return new CgElement({
            classes: _CLASSNAMES.fullscreenMenuBar,
            styles: this.options.Fullscreen!.Menubar!.background ? { values: [['background', this.options.Fullscreen!.Menubar!.background!]] } : undefined,
            children: [
                this.indicator,
                this.titleElement,
                {
                    tagName: _HTML.Tags.ul, classes: _CLASSNAMES.fullscreenMenuBarBtnGroup,
                    children: [
                        // BUTTONS:
                        // {
                        //     tagName: _HTML.Tags.li, classes: _CLASSNAMES.fullscreenMenuBarBtn, eventListeners: [{
                        //         action: _EVENT_ACTIONS.click, handler: (event) => { this.setThumbnailsActiveState(); }
                        //     }], children: [{ tagName: _HTML.Tags.i, classes: _CLASSNAMES.iconTiles }]
                        // },
                        {
                            tagName: _HTML.Tags.li, classes: _CLASSNAMES.fullscreenMenuBarBtn, eventListeners: [{
                                action: _EVENT_ACTIONS.click, handler: (event) => { this.setThumbnailsActiveState(); }
                            }], styles: this.options.Fullscreen!.btns!.background ? { values: [['color', this.options.Fullscreen!.btns!.background!]] } : undefined,
                            children: [{
                                tagName: _HTML.Tags.i, classes: _CLASSNAMES.iconThumbnails,
                                styles: this.options.Fullscreen!.color ? {
                                    values: [['border-color', this.options.Fullscreen!.color]]
                                } : undefined
                            }]
                        },
                        {
                            tagName: _HTML.Tags.li, classes: _CLASSNAMES.fullscreenMenuBarBtn, eventListeners: [{
                                //action: _EVENT_ACTIONS.click, handler: (event) => { _PLATFORM.overlay.close(); 
                                action: _EVENT_ACTIONS.click, handler: () => this.close ()
                            }], children: [{
                                tagName: _HTML.Tags.i, classes: _CLASSNAMES.iconClose,
                                styles: this.options.Fullscreen!.color ? {
                                    //values: [['background-color', this.options.fullscreen!.color!]],
                                    childValues: [{
                                        id: [':before', ':after'],
                                        values: [['background-color', this.options.Fullscreen!.color!]]
                                    }]
                                } : undefined
                            }]
                        }
                    ]
                }
            ]
        });
    }

    setMenubarFixed(value: boolean) {
        //let classList = this.menubar.Element.classList;
        let classList = this.element!.Element.classList;
        if (value) {
            classList.add(_CLASSNAMES.fixed);
        }
        else {
            classList.remove(_CLASSNAMES.fixed);
        }
    }

    public setMediaInfo(media: IMedia, index: number, length: number, carousel: Carousel) {
        if (!media.element) media.element = findElement(media.containerElement!, _HTML.Tags.img)!;

        this.indicator!.Element.innerText = `${index} / ${length}`;
        this.titleElement!.Element.innerText = media.title || '';
        //let descHeight: number | undefined;

        carousel.DescriptionElement.Element.innerText = media.description || '';
        let descHeight = carousel.DescriptionElement.Element.clientHeight;

        const pb = 'padding-bottom';
        if (media.description && descHeight)
            carousel.CarouselElement!.Element.style.setProperty(pb, `${descHeight}px`, 'important');
        else
            carousel.CarouselElement!.Element.style.removeProperty(pb);
    }

}
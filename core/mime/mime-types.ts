class MimeType {
    constructor(
        public readonly type: string,
        public readonly exts: string[]
    ) { }
}

class MimeGroup {
    constructor(
        public readonly name: string,
        public readonly types: MimeType[]
    ) { }

    findExtension(type: string) {
        return this.types.find(e => e.type == type)?.exts?.find(e => e);
    }

    findExtensions(type: string) {
        return this.types.find(e => e.type == type)?.exts;
    }

    findType(extension: string) {
        return this.types.find(t => t.exts.some(e => e == extension))?.type;
    }
}

export const imageMimeTypes: MimeType[] = [
    new MimeType('image/gif', ['gif']),
    new MimeType('image/jpeg', ['jpeg', 'jpg']),
    new MimeType('image/png', ['png']),
    new MimeType('image/apng', ['apng']),
    new MimeType('image/tiff', ['tif', 'tiff']),
    new MimeType('image/vnd.wap.wbmp', ['wbmp']),
    new MimeType('image/x-icon', ['ico']),
    new MimeType('image/x-jng', ['jng']),
    new MimeType('image/x-ms-bmp', ['bmp']),
    new MimeType('image/svg+xml', ['svg']),
    new MimeType('image/webp', ['webp']),
    new MimeType('image/avif', ['avif'])
];

class MimeFinder {
    public readonly image = new MimeGroup('image', imageMimeTypes);

    public findExtension(type: string) {
        return [this.image]
            .find(x => x.findExtension(type));
    }

    public findExtensions(type: string) {
        return [this.image]
            .find(x => x.findExtensions(type));
    }

    public findType(type: string) {
        return [this.image]
            .find(x => x.findType(type));
    }
}

export const mimes = new MimeFinder();
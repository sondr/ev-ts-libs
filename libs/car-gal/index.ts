import '../style.scss';

import { CarGal } from './car-gal';
import { Config } from './interfaces';
import { Configure } from './config';

export function init(config?: Config) {
    return new CarGal(Configure(config));
}
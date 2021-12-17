import { Injectable } from '@angular/core';
import BDCashCore from '../assets/js/bdcashcore.js';

export interface ICustomWindow extends Window {
    BDCashCore: BDCashCore;
}

function getWindow (): any {
    return window;
}

@Injectable()
export class WindowRefService {
    get nativeWindow (): ICustomWindow {
        return getWindow();
    }
}
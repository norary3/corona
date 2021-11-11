/* eslint-disable @typescript-eslint/no-redeclare */
import { Property } from 'csstype';

const colors = {
    
    PrimaryBlue:    '#2878F0',
    
    DarkerBlack:    '#4A4A4A',
    DefualtBlack:   '#3C3C46',
    TextBlack:      '#282828',

    BackgroundGray: '#F8F8F8',
    LineGray:       '#CCCCCC',
    LighterGray:    '#C4C4C4',

};
type NamedColor = keyof typeof colors;
export const Color = colors as {[key in NamedColor]:Property.Color};
export type Color = typeof Color[keyof typeof Color];


function validateColorCode(color: string) {
    if((color.length !== 7) || (color[0] !== '#')) {
        throw new Error('INVALID_COLOR_VALUE');
    }
}

export function withAlpha(color: string, alpha: number) {
    validateColorCode(color);
    let alphaCode = Math.round((alpha * 256) - 1).toString(16);
    if(alphaCode.length === 1)
        alphaCode = '0' + alphaCode;
    return color + alphaCode;
}
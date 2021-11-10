/* eslint-disable @typescript-eslint/no-redeclare */
import { Property } from 'csstype';

const colors = {
    BackgroundGray: '#F8F8F8',
    PrimaryBlue:    '#2878F0',
    DefualtBlack:   '#3C3C46',
    TextBlack:      '#282828',
    LineGray:       '#CCCCCC',
};
type NamedColor = keyof typeof colors;
export const Color = colors as {[key in NamedColor]:Property.Color};
export type Color = typeof Color[keyof typeof Color];

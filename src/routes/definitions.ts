import { JSXElementConstructor } from 'react';
import { RouteProps } from 'react-router-dom';
import Dashboard from 'src/pages/dashboard';

export const SCREEN = {
    DASHBOARD:          '/',
};

export interface IRouteConfig extends RouteProps{
    constructor:      JSXElementConstructor<any>;
}

export const ROUTE: { [key: string]: IRouteConfig; } = {
    [SCREEN.DASHBOARD]: {
        path: SCREEN.DASHBOARD,
        constructor: Dashboard,
    },
};


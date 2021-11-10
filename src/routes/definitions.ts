import { JSXElementConstructor } from 'react';
import { RouteProps } from 'react-router-dom';
import Dashboard from 'src/pages/dashboard';

/**
* 화면별 path
*/
export const PAGE = {
    DASHBOARD:  '/',
    RESEARCH:   '/research',    
    INSIGHT:    '/insight', 
    MEMBERS:    '/members',
    CALENDAR:   '/calendar',
};

/**
* PAGE별 Route를 위한 설정값 
*/
export interface IRouteConfig extends RouteProps{
    /** 해당 PAGE 접근 시 표시할 Component의 생성 함수 */
    constructor: JSXElementConstructor<any>;
}

export const ROUTE: { [key: string]: IRouteConfig; } = {
    [PAGE.DASHBOARD]: {
        path: PAGE.DASHBOARD,
        constructor: Dashboard,
    },
};


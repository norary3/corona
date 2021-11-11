import React, { CSSProperties } from 'react';
import { Link, To, useLocation } from 'react-router-dom';
import { ReactComponent as Calendar } from 'src/assets/icon-calendar.svg';
import { ReactComponent as Dashboard } from 'src/assets/icon-dashboard.svg';
import { ReactComponent as Insight } from 'src/assets/icon-insight.svg';
import { ReactComponent as Logo } from 'src/assets/icon-logo.svg';
import { ReactComponent as Members } from 'src/assets/icon-members.svg';
import { ReactComponent as Research } from 'src/assets/icon-research.svg';
import { PAGE } from 'src/routes/definitions';
import { Color } from 'src/styles/guideline';
import styled from 'styled-components';

const WIDTH =               156;
const PADDING =             48;
const ITEM_HEIGHT =         40;
const SPACE_LABEL_LIST =    40;
const SPACE_LIST_ITEM =     32;
const SPACE_ICO_LABEL =     8;
const FONT_SIZE =           16;

interface MenuItemConfig {
    /** 각 아이템에 표시될 아이콘 SVG */
    icon: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
    /** 각 아이템의 제목 */
    label: string | undefined;
    /** 클릭 시 이동할 PAGE */
    to: To;
}

/** 각 메뉴별 설정값 */
const ITEMS: Array<MenuItemConfig> = [
    { icon: Dashboard,  label: 'Dashboard', to: PAGE.DASHBOARD },
    { icon: Research,   label: 'Research',  to: PAGE.RESEARCH },
    { icon: Insight,    label: 'Insight',   to: PAGE.INSIGHT },
    { icon: Members,    label: 'Members',   to: PAGE.MEMBERS },
    { icon: Calendar,   label: 'Calendar',  to: PAGE.CALENDAR },
];

const LabelContainer = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
`;
const Title = styled.p`
    margin-left: ${SPACE_ICO_LABEL}px;
    font-weight: bold;
`;
/** 회사 로고 및 회사명 */
function Header({
    style,
}:{
    style?: CSSProperties;
}) {
    return <LabelContainer style={{
        ...style,
    }}>
        <Logo/>
        <Title>DBDLAB Corp.</Title>
    </LabelContainer>
}

const MenuItemContainer = styled.li`
    margin-bottom: ${SPACE_LIST_ITEM}px;
`;
const SelectableLink = styled(Link)<{
    selected: boolean;
}>`
    align-items: center;
    display: flex;
    flex-direction: row;
    height: ${ITEM_HEIGHT}px;
    color:  ${ props => props.selected ? Color.PrimaryBlue : Color.TextBlack};
    text-decoration-line: none;
`;
const MenuLabel = styled.p<{
    selected: boolean;
}>`
    margin-left: ${SPACE_ICO_LABEL}px;
    font-size: ${FONT_SIZE}px;
    line-height: 1;
    font-weight: ${ props => props.selected ? 'bold' : 'normal' };
`;
/** 개별 메뉴 아이템 */
function MenuItem({
    Icon,
    children,
    to,
    selected = false,
}:{
    Icon: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
    children: string | undefined;
    to: To;
    selected?: boolean;
}) {

    return <MenuItemContainer>
        <SelectableLink selected={ selected } to={ to }>
            <Icon fill={ selected ? Color.PrimaryBlue : Color.DefualtBlack }/>
            <MenuLabel selected={ selected }>{ children }</MenuLabel>
        </SelectableLink>
    </MenuItemContainer>
}

/** PAGE 변경을 위한 메뉴 버튼들의 목록 */
function Menu() {
    const location = useLocation();
    const path = `/${location.pathname.split('/')[1]}`;

    return <ul style={{
        paddingInlineStart: 0,
    }}>
        { ITEMS.map(item => {
            return <MenuItem
            key={ item.label }
            Icon={ item.icon }
            to={ item.to }
            selected={ path === item.to }>
                { item.label }
                </MenuItem> 
        }) }
    </ul>
}

function SideBar() {
    return <nav style={{
        width: WIDTH,
        padding: PADDING,
    }}>
        <Header style={{
            marginBottom: SPACE_LABEL_LIST,
        }}/>
        <Menu/>
    </nav>;
};

export default SideBar;

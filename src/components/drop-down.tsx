import { CSSProperties, useCallback, useEffect, useState } from 'react';
import { ReactComponent as ArrowDown } from 'src/assets/arrow-down.svg';
import styled from 'styled-components';

const MARGIN = 8;

const Container = styled.div`
    position: relative;
    display: flex;
    flex-direction: column;
`

const Section = styled.div`
    width: 90px;
    height: 26px;
    display: flex;
    flex-direction: row;
    align-items: center;
`

const Label = styled.p`
    font-size: 14px;
    font-weight: normal;
`

function Item({
    children,
    onClick,
}:{
    children: string;
    onClick: ()=>void;
}) {
    return <li>
        <Label onClick={ onClick }>{ children }</Label>
    </li>;
}

function DropDown({
    style,
    items,
    onItemSelect,
}:{
    style?: CSSProperties;
    items: string[];
    onItemSelect?: (item:string) => void;
}) {
    const [selected, select] = useState(items[0]);
    const [spread, setSpread] = useState(false);

    const handleArrowClick = useCallback(()=>{
        setSpread(!spread);
    },[spread]);

    const handleItemSelect = useCallback((item: string)=>{
        select(item);
        setSpread(!spread);
    }, [spread]);

    useEffect(()=>{
        onItemSelect && onItemSelect(selected);
    }, [onItemSelect, selected]);

    return <Container>
        <Section style={ style } onClick={ handleArrowClick } >
            <Label>{ selected }</Label>
            <ArrowDown style={{
                marginLeft: MARGIN,
            }} />
        </Section>
        <ul style={{
            display: spread ? 'block' : 'none',
        }}>
            { items.filter(item=>item !== selected).map(item =>{
                return <Item onClick={ ()=>handleItemSelect(item) }>{ item }</Item>;
                })}
        </ul>
    </Container>;
}

export default DropDown;

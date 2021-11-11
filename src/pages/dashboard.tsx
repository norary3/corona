import { CSSProperties, useCallback, useEffect, useState } from 'react';
import DropDown from 'src/components/drop-down';
import { Color, withAlpha } from 'src/styles/guideline';
import styled from 'styled-components';

import { Container } from './styles';

const AgeGroup = {
    Young : {
        min: 18,
        max: 34,
    },
    Middle : {
        min: 35,
        max: 49,
    },
    Old : {
        min: 50,
        max: 64,
    },
} as const;
// eslint-disable-next-line @typescript-eslint/no-redeclare
type AgeGroup = typeof AgeGroup[keyof typeof AgeGroup];

interface Cell {
    date: Date;
    ageGroup: AgeGroup;
}

const BORDER_LINE_STYLE = `1px solid ${withAlpha(Color.LineGray, 0.5)}`;
const PADDING = 16;

const Section = styled.div`
    display: flex;
    flex-direction: column;
`
const TitleCell = styled.div`
    height: 40px;
    border-bottom: ${BORDER_LINE_STYLE};
    padding: 0 24px;
`
const TitleLabel = styled.p`
    font-weight: bold;
    font-size: 14px;
    line-height: 1;
`;

function ChartTitle({
    children,
}:{
    children: string;
}) {
    return <TitleCell>
        <TitleLabel>{ children }</TitleLabel>
    </TitleCell>;
}

function Chart({
    style,
}:{
    style?: CSSProperties;
}) {
    return <div style={{
        width: 200,
        height: 200,
        backgroundColor: 'blueviolet',
        alignSelf: 'center',
        ...style,
    }}/>;
}

const DROP_DOWN_ITEMS = [
    'Daily',
    'Monthly',
] 

function TotoalChart() {
    return <Section>
        <ChartTitle>{ '코로나 일자별  총 확진자 수' }</ChartTitle>
        <Section style={{
            flexDirection: 'row',
            justifyContent: 'space-around',
            padding: PADDING,
        }}>
            <Chart style={{
                width: 400,
            }}/>
            <DropDown items={ DROP_DOWN_ITEMS }/>
        </Section>
    </Section>;
}

function DailyByAgeGroupChart({
    style,
    onCellSelect,
}:{
    style: CSSProperties;
    onCellSelect: (cell:Cell)=>void;
}) {
    return <Section style={ style }>
        <ChartTitle>{ '일자별  연령대  확진자 수' }</ChartTitle>
        <Chart />
    </Section>;
}

function GenderChart({
    date,
    ageGroup,
    style,
}:Cell & {
    style: CSSProperties;
}) {

    function createTitle(date:Date, ageGroup:AgeGroup){
        const convertToTwoDigits = (n:number) => n.toLocaleString(undefined,{
            minimumIntegerDigits: 2,
        });

        return `(${convertToTwoDigits(date.getMonth())}/${convertToTwoDigits(date.getDate())}) `
        + `${ageGroup.min}-${ageGroup.max}대 성별  확진자 수`;
    }

    const [title, setTitle] = useState(
        createTitle(date, ageGroup)
    );

    useEffect(()=>{
        setTitle(
            createTitle(date, ageGroup)
        );
    },[date, ageGroup]);

    return <Section style={ style }>
        <ChartTitle>{ title }</ChartTitle>
        <Chart />
    </Section>;
}

function Dashboard() {
    const [selectedCell, selectCell] = useState<Cell>({
        date: new Date(2021,11,7),
        ageGroup: AgeGroup.Young,
    });

    const handleCellSelect = useCallback((cell: Cell)=>{
        selectCell(cell);
    },[]);

    return <Container>
        <Section>
            <TotoalChart />
            <Section style={{
                borderTop: BORDER_LINE_STYLE,
                flexDirection: 'row',
            }}>
                <DailyByAgeGroupChart style={{
                    flex: 1,
                    borderRight: BORDER_LINE_STYLE,
                }} onCellSelect={ handleCellSelect }/>
                <GenderChart style={{
                    flex: 1,
                }} {...selectedCell} />
            </Section>
        </Section>
    </Container>
};

export default Dashboard;

import _ from 'lodash';
import React, { CSSProperties, useCallback, useEffect, useState } from 'react';
import {
    Bar, BarChart, Cell, Legend, Line, LineChart, Pie, PieChart, ResponsiveContainer, XAxis, YAxis
} from 'recharts';
import {
    AgeCaseInf, GenCaseInf, getCovid19GenAgeCaseInfAsync, getCovid19InfStateAsync, InfState
} from 'src/api';
import DropDown from 'src/components/drop-down';
import { formatDate } from 'src/lib';
import { Color, withAlpha } from 'src/styles/guideline';
import styled from 'styled-components';
import { useAsyncEffect } from 'use-async-effect';

import { Container } from './styles';

const BORDER_LINE_STYLE = `1px solid ${withAlpha(Color.LineGray, 0.5)}`;
const PADDING = 16;

const DROP_DOWN_ITEMS = [
    'Daily',
    'Monthly',
];

const GENDER_COLORS = ["#629ACD", "#E79997"] // male, female
const AGE_COLORS = [
    "#cdc662", "#9fcd62", "#62cd7d",
    "#62c6cd", "#629ACD", "#9287D8",
    "#CD87D8", "#E79997", "#e76c6c",
];

const ChartWrapper = styled.div`
    width: 80%;
    margin: 70px auto;
`
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
    color: ${Color.DarkerBlack};
`;

const tickFormatter = (value: number) => new Intl.NumberFormat('en').format(value)

function ChartTitle({
    children,
}:{
    children: string;
}) {
    return <TitleCell>
        <TitleLabel>{ children }</TitleLabel>
    </TitleCell>;
}

function TotoalChart() {
    const [data, setData] = useState<InfState[]>([])
    const [domain, setDomain] = useState([0,1000]);

    useAsyncEffect(async ()=>{
        setData( await getCovid19InfStateAsync() );
    },[]);

    useEffect(()=>{
        const counts = data?.map(d=>d.count);
        const [min, max] = [Math.min(...counts), Math.max(...counts)];
        const scale = Math.pow(10, Math.floor( Math.log10(max) ) - 1 ) ;

        setDomain([
            Math.floor( min/scale ) * scale,
            Math.ceil( max/scale ) * scale,
        ])
    }, [data]);

    return <Section>
        <ChartTitle>{ '코로나 일자별  총 확진자 수' }</ChartTitle>
        <Section style={{
            flexDirection: 'row',
            justifyContent: 'space-around',
            padding: PADDING,
        }}>
            <ResponsiveContainer
                minWidth={ 400 }
                minHeight={ 200 }
                width="60%"
                height="60%">
                <LineChart style={{
                    fontWeight: 'normal',
                    fontSize: 12,
                    marginTop: 46,
                }} data={ data }>
                    <Line dataKey="count" dot={ false }/>
                    <XAxis style={{
                        fill: Color.DefualtBlack,
                    }} dataKey="dateString" padding={{ left: 24, right: 24 }}/>
                    <YAxis style={{
                        fill: Color.LighterGray,
                    }} domain={ domain }
                    tickFormatter={ tickFormatter }/>
                </LineChart>
            </ResponsiveContainer>
            <DropDown items={ DROP_DOWN_ITEMS }/>
        </Section>
    </Section>;
}

const renderLegendText = (value: string) => {
    return <span style={{
        color: Color.DefualtBlack,
        fontSize: 12,
    }}>{value}</span>;
};

function DailyByAgeGroupChart({
    data,
    style,
    onDateSelect,
}:{
    data: AgeCaseInf[];
    style: CSSProperties;
    onDateSelect: (dateString:string)=>void;
}) {

    const ageGroups = _.keys(data[0]).filter(k=>k!=='dateString');

    const handleDateSelect = useCallback((
        entry:any, index:number,
    )=>{
        onDateSelect(data[index].dateString)
    }, [data, onDateSelect]);

    return <Section style={ style }>
        <ChartTitle>{ '일자별  연령대  확진자 수' }</ChartTitle>
        <ChartWrapper>
            <ResponsiveContainer
                minWidth={ 300 }
                minHeight={ 200 }
                width="100%"
                height="100%">
                <BarChart style={{
                    fontSize: 12,
                }} layout={ 'vertical' } data={ data }>
                    <YAxis style={{
                        fontWeight: 'bold',
                        fill: Color.DefualtBlack,
                    }} dataKey="dateString" type="category" />
                    <XAxis style={{
                        fill: Color.LighterGray,
                    }} type="number" tickFormatter={ tickFormatter }/>
                    <Legend formatter={ renderLegendText }/>
                    { ageGroups.map((ag, idx)=>{
                        return <Bar
                            key={`cell-${idx}`}
                            dataKey={ ag }
                            stackId="a"
                            onClick={ handleDateSelect }
                            fill={AGE_COLORS[idx % AGE_COLORS.length]}/>
                    }) }
                </BarChart>
            </ResponsiveContainer>
        </ChartWrapper>       
    </Section>;
}

function GenderChart({
    data,
    dateString,
    style,
}: {
    data: GenCaseInf[];
    dateString: string;
    style: CSSProperties;
}) {

    const [title, setTitle] = useState(
        `(${dateString}) 성별  확진자 수`
    );

    const [selectedData, selectData] = useState<{
        name: string; value: number;
    }[]>([]); 

    useEffect(()=>{
        setTitle(`(${dateString}) 성별  확진자 수`);
    }, [dateString]);

    useEffect(()=>{
        const dataOfDate = data.find(v => v.dateString === dateString) ?? data[0] ?? {
            male: 0, female: 0,
        };

        console.log('dataOfDate',dataOfDate);

        selectData([
            { name: '남', value: dataOfDate.male },
            { name: '여', value: dataOfDate.female }
        ]);
    }, [data, dateString]);

    return <Section style={ style }>
        <ChartTitle>{ title }</ChartTitle>
        <ChartWrapper style={{
            margin: '60px auto',
        }}>
            <ResponsiveContainer
                minWidth={ 300 }
                minHeight={ 200 }
                width="100%"
                height="100%">
                <PieChart layout={ 'vertical' } >
                    <Pie
                        data={selectedData}
                        dataKey="value"
                        innerRadius="33%"
                        startAngle={90}
                        endAngle={-270}>
                        {data.map((entry, index) => (
                            <Cell
                                key={`cell-${index}`}
                                fill={GENDER_COLORS[index % GENDER_COLORS.length]}
                                stroke="none" />
                        ))}
                    </Pie>
                    <Legend formatter={ renderLegendText }/>
                </PieChart>
            </ResponsiveContainer>
        </ChartWrapper>
    </Section>;
}

function Dashboard() {

    const [selected, select] = useState( formatDate(new Date(2021,10,1)) );
    const [ageData, setAgeData] = useState<AgeCaseInf[]>([]);
    const [genderData, setGenderData] = useState<GenCaseInf[]>([]);

    useAsyncEffect(async ()=>{
        const [age, gender] = await getCovid19GenAgeCaseInfAsync();
        setAgeData(age);
        setGenderData(gender);
    },[]);

    const handleDateSelect = useCallback((dateString: string)=>{
        select(dateString);
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
                }} onDateSelect={ handleDateSelect } data={ ageData }/>
                <GenderChart style={{
                    flex: 1,
                }} dateString={ selected } data={ genderData }/>
            </Section>
        </Section>
    </Container>
};

export default Dashboard;

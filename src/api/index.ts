import axios from 'axios';
import _ from 'lodash';
import { formatDate } from 'src/lib';

const DECODING_KEY = process.env.REACT_APP_COVID19_DECODING_KEY;

const protocol = (window.location.protocol === 'http:' ? 'http:' : 'https:');

const instance = axios.create({
	baseURL: protocol + '//cors-anywhere.herokuapp.com/http://openapi.data.go.kr/openapi/service/rest/Covid19/',
	timeout: 5000,
});

interface Data<T extends {}> {
    response: {
        body: {
            items: {
                item: T[];
            }
        }
    }
}
 
interface APICallParmas {
    endPoint:       string;
    params:        {[key:string]:string|number;};
}

async function getAsync<T extends {}>({
    endPoint,
    params,
}:APICallParmas) {
    
    try {

        const response = await instance.get<Data<T>>(endPoint, {
            params,
        });

        if(response.status !== 200) {

            console.error(endPoint + ' Call 중 오류 발생');
            console.log(response);

            return [];
        }

        return await response.data.response.body.items.item;

    } catch(err) {
        console.error(err);
    }
    throw new Error();
}

interface InfStateItem {
    createDt: string;
    decideCnt: number;
}

export type InfState = {
    dateString: string;
    count: number;
}

export async function getCovid19InfStateAsync(): Promise<InfState[]> {
    const endPoint = 'getCovid19InfStateJson';
    const params = {
        ServiceKey : DECODING_KEY ?? '',
        startCreateDt: 20211101,
        endCreateDt: 20211107,
    }

    const data = await getAsync<InfStateItem>({
        endPoint, params,
    });

    const result: InfState[] = data.map(v=>({
        dateString: formatDate(new Date(v.createDt)),
        count: v.decideCnt,
    }));

    return result.reverse();

}

interface GenAgeCaseInfItem {
    confCase: number;
    createDt: string;
    gubun: string;
}

export type AgeCaseInf ={
    [key:string] : number | string;
    dateString: string;
}
export type GenCaseInf = {
    dateString: string;
    female: number;
    male: number;
}

export async function getCovid19GenAgeCaseInfAsync(): Promise<[AgeCaseInf[], GenCaseInf[]]> {
    const endPoint = 'getCovid19GenAgeCaseInfJson';
    const params = {
        ServiceKey: DECODING_KEY ?? '',
        startCreateDt: 20211101,
        endCreateDt: 20211107,
    }

    const data = await getAsync<GenAgeCaseInfItem>({
        endPoint, params,
    });

    const ageDict: {
        [dateString:string] : {
            [age:string] : number;
        };
    } = {};

    const genDict: {
        [dateString:string] : {
            female?: number;
            male?: number;
        };
    } = {};

    data.forEach(v=>{
        const dateString = formatDate(new Date(v.createDt));

        if(!ageDict[dateString]) ageDict[dateString] = {};
        if(!genDict[dateString]) genDict[dateString] = {};

        switch (v.gubun) {
            case '여성' :
                genDict[dateString].female = v.confCase;
                break;
            case '남성' :
                genDict[dateString].male = v.confCase;
                break;
            default :
                ageDict[dateString][v.gubun] = v.confCase;
        }
    })

    const ageResult = _.map(ageDict, (v,k)=>{
        const converted: AgeCaseInf = {
            dateString : k,
        };
        _.forEach(v, (count, age)=> {
            converted[age] = count;
        })
        return converted;
    });

    const genResult = _.map(genDict, (v,k)=>({
        dateString: k,
        female: v.female ?? 0,
        male: v.male ?? 0,
    }));

    return [ageResult.reverse(), genResult.reverse()];
}

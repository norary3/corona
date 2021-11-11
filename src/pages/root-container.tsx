import { values } from 'lodash';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SideBar from 'src/components/side-bar';
import { Color } from 'src/styles/guideline';
import styled from 'styled-components';

import { ROUTE } from '../routes/definitions';

/** 사이드바와 메인섹션을 포함하는 사이트 전체 */
const AppBlock = styled.div`
    display: flex;
    flex-direction: row;
    width: 100%;
    margin: 0 auto;
    height: 100vh;
    background-color: ${Color.BackgroundGray};
`;

/** 메인섹션 */
const ContentsBlock = styled.div`
    display: flex;
    flex-direction: column;
    flex: 1;
    padding: 48px 0 0 24px;
`;

/** Route를 위한 Container */
function RootContainer() {

    return (
        <Router>
            <AppBlock>
                <SideBar />
                <Routes>
                    { values(ROUTE).map((route, index) =>
                        <Route
                            key={ index }
                            element={ <ContentsBlock>
                                <route.constructor/>
                            </ContentsBlock> }
                            {...route} />,
                    ) }
                </Routes>
            </AppBlock>
        </Router>
    );
}

export default RootContainer;

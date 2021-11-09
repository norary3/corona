import { values } from 'lodash';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SideBar from 'src/components/side-bar';
import styled from 'styled-components';

import { ROUTE } from './definitions';

const AppBlock = styled.div`
    display: flex;
    flex-direction: row;
    width: 100%;
    margin: 0 auto;
    height: 100vh;
    align-items: center;
`;

const ContentsBlock = styled.div`
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 100%;
`;

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

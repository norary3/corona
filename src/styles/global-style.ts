import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`

    body {
        margin: 0;
        font-family: Red Hat Display, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
    }

    ul {
        margin-block: 0px;
        padding-inline-start: unset;
    }

    li {
        list-style: none;
    }
`;

export default GlobalStyle;

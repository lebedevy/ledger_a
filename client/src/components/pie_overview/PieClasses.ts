import { css } from 'emotion';

export const legendCss = css`
    background: #E7E5E8;
    display: flex;
    margin: 0 10px;
    flex-direction: column;
    width: 200px;
    max-width: 200px;
    overflow: auto;
    padding: 0 5px;
    border: solid 1px #00000020;
    border-radius: 5px;
    height: 80vw;
    max-height: 500px;
    h2 {
        textAlign: center;
        margin: 20px 0 5px 0;
`;

export const legendItemCss = css`
    padding: 5px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    cursor: pointer;
`;

export const labelCss = css`
    padding-right: 5px;
    word-break: break-all;
`;

import { css } from 'emotion';

export const bigButtonCss = (args?: any) => {
    return getBigButtonCss(args ?? {});
};

const getBigButtonCss = ({ main, secondary }: { main?: string; secondary?: string }) => css`
    font-size: 1em;
    padding: 10px;
    border-radius: 7px;
    background-color: #${main ?? '37509b'};
    color: white;
    border-color: #${secondary ?? '4460b7'};
    min-width: 75px;
    &:hover {
        background-color: #4764bc;
    }
`;

export const flexJustifyCenterCss = css`
    display: flex;
    justify-content: center;
`;

export const flexCenterCss = css`
    ${flexJustifyCenterCss}
    align-items: center;
`;

export const backdropCss = css`
    ${flexCenterCss}
    z-index: 100;
    position: absolute;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
    background: #00000060;
`;

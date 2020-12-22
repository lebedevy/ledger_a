import { css } from 'emotion';
import styled from '@emotion/styled';
import { css as css2, SerializedStyles } from '@emotion/react';

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

type FlexArgs = {
    column?: boolean;
    fillHeight?: boolean;
    fillWidth?: boolean;
    dontFill?: boolean;
    center?: boolean;
    spaceBetween?: boolean;
    css?: SerializedStyles;
};

export const flexCss = (props: FlexArgs) => css2`
    ${props.dontFill ? '' : 'flex: 1;'}
    display: flex;
    flex-direction: ${props.column ? 'column' : 'row'};
    ${props.fillHeight ? 'height: 100%;' : ''}
    ${props.fillWidth ? 'width: 100%;' : ''}
    ${props.center ? 'justify-content: center; align-items: center;' : ''}
    ${props.spaceBetween ? 'justify-content: space-between;' : ''}
`;

export const Flexbox = styled.div<FlexArgs>`
    ${flexCss}
    ${(props) => props.css ?? ''}
`;

// unstyled button
const UButton = css2`
    border: none;
    background-color: transparent;
    outline: none;
    margin: 0;
    padding: 0;
`;

export const CellButton = styled.button`
    ${UButton}
    ${flexCss({ center: true, dontFill: true })}
    border-radius: 50%;
    &:hover {
        background-color: lightgray;
    }
    &:active {
        background-color: gray;
    }
`;
// transition: background-color 0.5s;
// transition for color would be nice on click, but it also applies on hover (we want hover to be immediate for better user exprience)

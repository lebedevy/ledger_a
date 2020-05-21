import React from 'react';
import clsx from 'clsx';
import KeyboardArrowRightIcon from '@material-ui/icons/KeyboardArrowRight';
import KeyboardArrowLeftIcon from '@material-ui/icons/KeyboardArrowLeft';
import { css } from 'emotion';

const container = css`
    position: absolute;
    display: flex;
    top: 0;
    right: 0;
`;
const legendMobile = css`
    padding: 10px;
    display: flex;
    flex-direction: column;
    max-width: 200px;
`;
const legendOpen = css`
    background: #00000070;
    overflow: auto;
    width: 200px;
`;
const backdrop = css`
    background: #00000020;
    flex: 1;
`;
const openCss = css`
    bottom: 0;
    left: 0;
    right: 0;
`;
const legendOpenButton = css`
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 10px;
    font-weight: bold;
`;
const legendOpenTitle = css`
    color: white;
`;
const legendTitleMobile = css`
    flex: 1;
    text-align: center;
`;

export default function MobileLegend({ children, open, setLegendOpen }) {
    return (
        <div className={clsx(container, open && openCss)}>
            {open && <div className={backdrop} onClick={() => setLegendOpen(false)} />}
            <div className={clsx(legendMobile, open && legendOpen)}>
                <div
                    className={clsx(legendOpenButton, open && legendOpenTitle)}
                    onClick={() => setLegendOpen(!open)}
                    title={open ? 'Hide legend' : 'Show legend'}
                >
                    {open ? <KeyboardArrowRightIcon /> : <KeyboardArrowLeftIcon />}
                    <label className={legendTitleMobile}>Legend</label>
                </div>
                {open && children}
            </div>
        </div>
    );
}

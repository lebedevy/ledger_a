import React from 'react';
import { css } from 'emotion';
import { flexJustifyCenterCss, flexCenterCss } from '../components/styling/CommonStyles';

const darkerBlue = '#4764bc';
// const blue = '#7692FF';
const blue = '#5571dc';

const landingPage = css`
    height: 100vh;
    position: relative;
    width: 100%;
`;

const heroCss = css`
    ${flexJustifyCenterCss}
    position: relative;
    flex-direction: column;
    height: 70%;
    background-color: ${blue};
    overflow: auto;
    color: white;
    label {
        color: orange;
    }
`;

const headerCss = (p: string) => css`
    color: white;
    margin: 0;
    padding: 5px;
    padding-left: ${p}%;
`;

const heroText = css`
    width: 100%;
    position: absolute;
    top: 50%;
`;

const mainBar = css`
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: space-between;
`;

const pageTitle = css`
    margin: 0;
    padding: 10px;
    padding-left: 10%;
    font-size: 1.1em;
    white-space: nowrap;
    font-weight: 750;
`;

const signInButt = css`
    display: flex;
    justify-content: center;
    font-size: 0.9em;
    margin-right: 5px;
    padding: 5px;
    background-color: ${blue};
    color: white;
    border-radius: 5px;
    border: none;
    outline: none;
    min-width: 75px;
    font-weight: bold;
    &:hover {
        background-color: orange;
        color: black;
    }
    text-decoration: none;
`;

const callToAction = css`
    height: 20%;
    position: relative;
    ${flexCenterCss}
`;

const details = css`
    display: flex;
    min-height: 20%;
    background-color: ${blue};
`;

const signUp = css`
    margin-top: 5%;
    font-size: 1.4em;
    font-weight: bold;
    padding: 5px 15px;
    border: 3px solid ${darkerBlue};
    border-radius: 2px;
    color: ${darkerBlue};
    text-decoration: none;
    &:hover {
        color: orange;
        border-color: orange;
    }
`;

const footer = css`
    height: 15%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-end;
    background-color: #4c4c4c;
    color: white;
    a {
        cursor: pointer;
        color: white;
        text-decoration: none;
    }
`;

const detailsCard = css`
    color: white;
    display: flex;
    flex-direction: column;
    align-items: center;
    flex: 1;
    margin: 10px;
    padding: 0 10px;
    border: 1px #ffffff10 solid;
    border-radius: 5px;
    text-align: center;
`;

const questions = css`
    flex: 1;
    display: flex;
    align-items: center;
    font-size: 1.5em;
    font-weight: 900;
`;

const citing = css`
    width: 100%;
    padding: 0 0 10px 10px;
`;

const cardTitle = css`
    color: white;
`;

export default function LandingPage() {
    return (
        <div className={landingPage}>
            <div className={mainBar}>
                <h1 className={pageTitle}>LEDGER A</h1>
                <a className={signInButt} href={'/users/login'}>
                    Sign in
                </a>
            </div>
            <div className={heroCss}>
                <div className={heroText}>
                    <h2 className={headerCss('5')}>
                        Tracking your <label>expenses</label> should be simple
                    </h2>
                </div>
            </div>
            <div className={callToAction}>
                <a className={signUp} href="/users/register">
                    SIGN UP
                </a>
            </div>
            <div className={details}>
                <div className={detailsCard}>
                    <h3 className={cardTitle}>Upload</h3>
                    <label>Upload your expenses with CSV</label>
                </div>
                <div className={detailsCard}>
                    <h3 className={cardTitle}>Verify</h3>
                    <label>
                        Every time you update your expenses, the system gets a little better at
                        recognizing them
                    </label>
                </div>
                <div className={detailsCard}>
                    <h3 className={cardTitle}>Review</h3>
                    <label>See your spending trends and habits</label>
                </div>
            </div>
            <div className={footer}>
                <label className={questions}>
                    <a href="mailto:support@ylebedev.com">Questions?</a>
                </label>
                <div className={citing}></div>
            </div>
        </div>
    );
}

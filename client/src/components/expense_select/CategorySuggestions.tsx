import React, { useState, useMemo, SyntheticEvent } from 'react';
import { css } from 'emotion';
import { backdropCss } from '../styling/CommonStyles';
import { getOptions } from '../../utility/utility';
import { CircularProgress } from '@material-ui/core';

const dropdownCss = css`
    position: absolute;
    top: 1.2em;
    z-index: 1000;
    width: 100%;
    background-color: white;
    border: solid 1px black;
    border-bottom-left-radius: 5px;
    border-bottom-right-radius: 5px;
    min-height: 20px;
`;

const ddOption = css`
    padding: 2.5px;
    &:hover {
        background-color: lightgray;
    }
`;

export function CategorySuggestions({
    classes,
    predictions,
    setCategory,
}: {
    classes: Array<string> | null | undefined;
    predictions: Array<number> | null;
    setCategory: (cat: string) => void;
}) {
    const [loading, setLoading] = useState(true);
    const options = useMemo(() => {
        if (classes && predictions) {
            const options = getOptions(predictions, classes);
            setLoading(false);
            return options;
        }
        return null;
    }, [classes, predictions]);

    const handleSetCategory = (e: SyntheticEvent, option: string) => {
        // Prevent bubbling to prevent triggering startEdit on parent cell
        e.stopPropagation();
        setCategory(option);
    };

    console.log(options);

    return (
        <div className={dropdownCss}>
            {loading || !options ? (
                <div className={backdropCss}>
                    <CircularProgress size={10} />
                </div>
            ) : (
                options.map((option) => (
                    <div
                        onClick={(e) => handleSetCategory(e, option[1] as string)}
                        className={ddOption}
                    >
                        {option[1]}
                    </div>
                ))
            )}
        </div>
    );
}

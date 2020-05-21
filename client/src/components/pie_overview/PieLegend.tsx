import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import MobileLegend from './legend/MobileLegend';
import { getCurrencyFormat } from '../../utility/utility';
import PieLegendDisplayOptions from './legend/PieLegendDisplayOptions';
import { IExpense, RootState, IAggregate } from '../typescript/general_interfaces';
import { legendItemCss, labelCss, legendCss } from './PieClasses';

interface IBase {
    data: Array<IAggregate>;
    setSelected: (data: IAggregate) => void;
}

interface IProps extends IBase {
    open: boolean;
    setLegendOpen: () => void;
}

export default function PieLegend({ open, setLegendOpen, data, setSelected }: IProps) {
    const [totals, setTotals] = useState(false);
    const { width } = useSelector((state: RootState) => state.screen);

    return (
        <React.Fragment>
            {width <= 700 ? (
                <MobileLegend open={open} setLegendOpen={setLegendOpen}>
                    <PieLegendDisplayOptions totals={totals} setTotals={setTotals} />
                    <LegendData data={data} setSelected={setSelected} totals={totals} />
                </MobileLegend>
            ) : (
                // Desktop/widescreen legend
                <div className={legendCss}>
                    <h2>Legend</h2>
                    <PieLegendDisplayOptions totals={totals} setTotals={setTotals} />
                    <LegendData data={data} setSelected={setSelected} totals={totals} />
                    {(!data || data.length === 0) && (
                        <label style={{ textAlign: 'center' }}>No expenses for the period</label>
                    )}
                </div>
            )}
        </React.Fragment>
    );
}

function LegendData({ data, setSelected, totals }: IBase & { totals: boolean }) {
    return (
        <>
            {data.map((el) => (
                <div
                    key={el.id}
                    className={legendItemCss}
                    style={{ background: `#${el.color}` }}
                    onClick={() => setSelected(el)}
                >
                    <label className={labelCss}>
                        {el['category'] ? el['category'] : el['store']}
                    </label>
                    {totals ? (
                        <label>{`$${getCurrencyFormat(el.amount)}`}</label>
                    ) : (
                        <label>{` ${Math.round(el.percent * 100)}%`}</label>
                    )}
                </div>
            ))}
        </>
    );
}

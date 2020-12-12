export interface IChildren {
    children: JSX.Element;
}

export interface IExpense {
    store: string;
    category: string;
    amount: number;
    date: string;
    id: number;
    user_id: number;
    [key: string]: any;
}

export interface IExclude {
    store?: string | number | boolean;
    category?: string | number | boolean;
    date?: string | number | boolean;
}

export interface IPrediction {
    expense_id: number;
    predictions: Array<number>;
}

export interface ITypes {
    [id: number]: number;
}

interface IUser {}

export interface RootState {
    editing: {
        cellEdit: null | string;
        deletingMode: { deleting: false; deleteIds: Array<number>; inProgress: false };
    };
    screen: { width: number; height: number; mobile: boolean };
    date: { period: { start: string; end: string } };
    uploadExpenses: {
        step: number;
        baseExpenses: originalExpenses;
        predictions: { classList: Array<string>; predictions: Array<IPrediction> };
        types: ITypes;
    };
    user: IUser;
}

export interface IAggregate extends IExpense {
    color: string;
    percent: number;
}

export interface IAggregated {
    store?: string;
    category?: string;
    amount: number;
    user_id: number;
    // Technically not applicable to aggregated expenses
    // But grabs the id of the first expense and uses it for keys in react maps
    id: number;
}

export interface originalExpenses {
    [id: number]: Array<string>;
}

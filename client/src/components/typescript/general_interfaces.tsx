export interface IExpense {
    store: string;
    category: string;
    amount: number;
    date: string;
    id: number;
}

export interface IExclude {
    store?: string;
    category?: string;
    date?: string;
}

export interface RootState {
    cellEdit: string | null;
    screen: { width: number; height: number };
    date: { period: { start: string; end: string } };
}

import { useSelector } from 'react-redux';
import { RootState } from '../components/typescript/general_interfaces';

interface IParams {
    [key: string]: string | number;
}

export const useGetData = () => {
    const { start, end, groupKey } = useSelector((state: RootState) => {
        return { ...state.date.period, ...state.appState };
    });

    return async (summary: boolean, params?: IParams) => {
        const properties = params ? Object.entries(params) : [];
        const parameters =
            properties.length > 0
                ? ', ' + properties.map(([key, value]) => `${key}: "${value}"`).join(', ')
                : null;

        // console.log(parameters);

        // FIX THIS -> need to move the group logic out
        const query =
            groupKey && parameters == null
                ? `
            query {
                expenses_grouped(start: "${start}", end: "${end}") {
                    amount(operation: SUM),
                    ${groupKey},
                    ${groupKey}_id
                }
            }
        `
                : `
            query {
                expenses(start: "${start}", end: "${end}") {
                    amount,
                    store,
                    category,
                    ${params?.store_id ? `store_id(id: ${params.store_id})` : ''}
                    ${params?.category_id ? `store_id(id: ${params.category_id})` : ''}
                }
            }
        `;

        console.log(query);
        // console.log(params);

        const res = await fetchPost(`/api/graphql`, { query });

        if (res.ok) {
            return (await res.json()).data[
                groupKey && parameters == null ? 'expenses_grouped' : 'expenses'
            ];
        } else {
            console.error('Error fetching data');
            console.log(await res.json());
            throw new Error('Request error');
        }
    };
};

const fetchPost = (url: string, body: any) =>
    fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
    });

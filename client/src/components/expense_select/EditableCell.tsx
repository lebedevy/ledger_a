import React, { useState, useEffect, SyntheticEvent, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setEditingExpense } from '../../redux/actions';
import { RootState } from '../typescript/general_interfaces';
import BasicEditableCell from './BasicEditableCell';

interface IProps {
    type: string;
    content: string | number;
    refetch: () => void;
    id?: number;
}

export default function EditableCell({ content, type, id, refetch }: IProps) {
    const dispatch = useDispatch();
    const { cellEdit } = useSelector((state: RootState) => state.editing);
    const [loading, setLoading] = useState(false);
    const [updated, setUpdated] = useState(false);
    const [classes, setClasses] = useState<Array<string> | null>(null);
    const [predictions, setPredictions] = useState<Array<number> | null>(null);
    const [showDropdown, setShowDropdown] = useState(false);

    const cellId = useMemo(() => `${id}.${type}`, [id, type]);
    const editing = useMemo(() => cellEdit === cellId, [cellId, cellEdit]);

    useEffect(() => {
        if (updated) {
            if (editing) setEditing(false);
            setUpdated(false);
            setLoading(false);
        }
    }, [updated, editing]);

    const setEditing = (start: boolean) => {
        dispatch(setEditingExpense(start ? cellId : null));
    };

    const submit = async (e: SyntheticEvent, value: string | number) => {
        // Stop onclick from triggering on parent
        e.stopPropagation();

        console.log('Sending request...');
        setLoading(true);
        const res = await fetch(`/api/users/expenses/edit/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ expense: { [type]: value } }),
        });

        if (res.status === 200) {
            setUpdated(true);
            refetch();
        }
    };

    const getCategorySuggestions = async () => {
        const res = await fetch(`/api/users/expenses/category_suggestions/${id}`);
        if (res.ok) {
            let test;
            const { classList, predictions } = (test = await res.json());
            console.log(test);
            console.log(classList, predictions);
            setClasses(classList);
            setPredictions(predictions[0].predictions);
            console.log(classList, predictions);
        }
    };

    const startEdit = () => {
        setEditing(true);
        setShowDropdown(true);
        if (type === 'category') getCategorySuggestions();
    };
    return (
        <BasicEditableCell
            setEditing={setEditing}
            content={content}
            submit={submit}
            classes={classes}
            predictions={predictions}
            editing={editing}
            startEdit={startEdit}
            loading={loading}
            type={type}
            showDropdown={showDropdown}
            setShowDropdown={setShowDropdown}
        />
    );
}

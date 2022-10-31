import React, { useState, useEffect } from 'react';
import styles from './css/EditTable.module.css';
import { MdOutlineCancel } from 'react-icons/md';
import { useStateContext } from '../contexts/ContextProvider';
import { Button } from '../components';
import { supabaseClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/router';

const EditTable = ({ onCancel, data, target, fields }) => {

    const { currentColor } = useStateContext();
    const [state, setState] = useState({});
    const [error, setError] = useState('');

    const router = useRouter();

    useEffect(() => {
        setState(data);
    }, [])

    const onInputUpdate = e => {
        setState(prev => ({ ...prev, [e.target.name]: e.target.value }));
        setError('')
    }

    const onSubmit = async () => {

        //validate name
        if (state.name.trim() === '') {
            setError('Table must have a name')
            return;
        }

        let payload = {
            name: state.name,
            description: state.description
        }

        const { data: res, err } = await supabaseClient
            .from('user_tables')
            .update(payload)
            .eq('id', data.id)

        if (err) {
            setError(err.message);
            return
        }

        if (res) {
            onCancel()
            refreshData()
        }

    }

    const onRemove = async () => {
        let con = confirm('Are you sure you wish to delete this table?');

        if (!con) {
            return
        }

        let payload = {
            is_archived: true
        }

        const { data: res, err } = await supabaseClient
            .from('user_tables')
            .update(payload)
            .eq('id', data.id)

        if (err) {
            setError(err.message);
            return
        }

        if (res) {
            onCancel()
            refreshData()
        }
    }

    const refreshData = () => {
        router.replace(router.asPath)
    }

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <div className={styles.cardHeading}>
                    <p className={styles.cardHeadingText}>
                        Edit Entry
                    </p>
                    <button
                        type="button"
                        onClick={onCancel}
                        style={{ color: 'rgb(153,171,180)', borderRadius: '50%' }}
                        className="text-2xl p-3 hover:drop-shadow-xl 
                        hover:bg-light-gray "
                    >
                        <MdOutlineCancel />
                    </button>
                </div>

                <div className="flex-col border-t-1
                border-color p-4 ml-4">
                    {
                        Object.keys(data).map((key, index) => {
                            if (fields && !fields.includes(key)) return;

                            return (
                                <div key={index} className={styles.inputContainer}>
                                    <div>
                                        <label htmlFor="name">{key}</label>
                                    </div>

                                    <input
                                        onChange={onInputUpdate}
                                        type="text"
                                        name={key}
                                        id={key}
                                        autoComplete="off"
                                        value={state[key]}
                                    />
                                </div>
                            )
                        })
                    }
                    <div className='p-4' onClick={onRemove}>
                        <p style={{ textDecoration: 'underline' }} className='text-xs font-semibold text-red-600 cursor-pointer'>
                            Delete item
                        </p>
                    </div>
                </div>

                <div className="flex-col border-t-1
                border-color p-4 ml-4">
                    <div className='flex justify-between'>
                        <Button
                            color="white"
                            bgColor="#adadad"
                            text="Cancel"
                            borderRadius="6px"
                            size="sm"
                            onClick={onCancel}
                        />

                        <Button
                            color="white"
                            bgColor={currentColor}
                            text="Save"
                            borderRadius="6px"
                            size="sm"
                            onClick={onSubmit}
                        />
                    </div>
                </div>

                {error !== '' && <div className='p-4 text-sm text-red-400 font-bold'>
                    <p>Error: {error}</p>
                </div>}

            </div>
        </div>
    );
}

export default EditTable;
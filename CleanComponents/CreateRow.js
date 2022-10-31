import React, { useEffect, useState } from 'react';
import styles from './css/CreateRow.module.css';
import { MdOutlineCancel } from 'react-icons/md';
import { supabaseClient } from '@supabase/auth-helpers-nextjs'
import { Button } from '../components';
import { useStateContext } from '../contexts/ContextProvider';
import { useRouter } from 'next/router';

const CreateRow = ({ onCancel, user, columns }) => {

    const { currentColor } = useStateContext();

    const [nextId, setNextId] = useState(null);
    const [error, setError] = useState('');
    const [rowData, setRowData] = useState({})

    let router = useRouter();

    useEffect(() => {
        //get table rows
        if (columns) {
            getNumberOfRows();

            console.log('cols', columns)
        }
    }, [columns])

    const getNumberOfRows = async () => {
        let { data, error } = await supabaseClient
            .from('user_tables')
            .select('num_rows')
            .eq('id', columns[0].table_id);

        if (error) {
            setError(errro.message);
            return;
        }

        if (data) {
            setNextId(data[0].num_rows + 1);
        }

    }

    const onInputUpdate = (e) => {
        setRowData(prev => ({ ...prev, [e.target.name]: e.target.value }))
    }

    const getColumnId = (name) => {
        for (let col of columns) {
            if (col.name === name) return col.id;
        }

        return -1;
    }

    const onSubmit = async (e) => {

        let payload = [];

        //mandatory field 
        let pcom = {
            column_id: getColumnId('Id'),
            row_position: nextId,
            data: nextId,
            author: user.id
        }

        payload.push(pcom);

        //add dynamic form fields
        Object.keys(rowData).forEach(key => {
            let p = {
                column_id: getColumnId(key),
                row_position: nextId,
                data: rowData[key],
                author: user.id
            }

            payload.push(p);
        });

        const { data, error: er } = await supabaseClient
            .from('column_data')
            .insert(payload)

        if (er) {
            setError(er.message);
            return;
        }

        if (data) {

            //update table data
            const { data: res, error: er2 } = await supabaseClient
                .from('user_tables')
                .update({
                    num_rows: nextId,
                })
                .eq('id', columns[0].table_id)

            if (er2) {
                setError(er2.message);
                return;
            }

            if (res) {
                onCancel();
                refreshData()
            }

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
                        Insert New Row
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

                    <div className={styles.inputContainer}>
                        <div>
                            <label htmlFor="id">Id</label>
                            <p className={styles.small}>numeric</p>
                        </div>

                        <input
                            type="text"
                            name='id'
                            id="id"
                            autoComplete="off"
                            value={nextId}
                            readOnly
                        />
                    </div>

                    {
                        columns.map((col, index) => {

                            if (col.name === 'Id' && col.position === -1) return;

                            return (
                                <div key={index} className={styles.inputContainer}>
                                    <div>
                                        <label htmlFor="name">{col.name}</label>
                                        <p className={styles.small}>{col.type}</p>
                                    </div>

                                    <input
                                        onChange={onInputUpdate}
                                        type="text"
                                        name={col.name}
                                        id="name"
                                        autoComplete="off"
                                    />
                                </div>
                            )
                        })
                    }

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
        </div >
    );
}

export default CreateRow;
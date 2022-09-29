import React, { useState } from 'react';
import styles from './css/CreateTable.module.css';
import { MdOutlineCancel } from 'react-icons/md';
import { Button } from '../components';
import { useStateContext } from '../contexts/ContextProvider';
import { TbMenu2 } from 'react-icons/tb'
import { supabaseClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/router';


const ColumnRow = ({ onChange, id, onRemove, data }) => {

    return (
        <tr >
            <td className={styles.rounded} style={{ backgroundColor: 'white' }}>
                <TbMenu2 />
            </td>
            <td >
                <input
                    autoComplete="off"
                    placeholder='Column name'
                    id={id} type="text"
                    name={"name"}
                    onChange={onChange}
                    value={data['name']}
                />

            </td >
            <td >
                <input
                    value={'text'}
                    id={id}
                    type="text"
                    name={"type"}
                    onChange={onChange}
                />
            </td>
            <td >
                <input
                    defaultValue={''}
                    id={id} type="text"
                    name={"default"}
                    value={data['default']}
                    onChange={onChange} />
            </td>
            <td >
                <div onClick={() => onRemove(id)} className={styles.tableButton}>
                    x
                </div>
            </td>
        </tr>
    )
}

const CreateTable = ({ onCancel, user }) => {

    const { currentColor } = useStateContext();
    const [columns, setColumns] = useState({});
    const [error, setError] = useState('')
    const [tableData, setTableData] = useState({
        name: '',
        desc: ''
    })

    let router = useRouter();

    const addColumn = () => {
        let id = getNextId();
        let c = {
            id,
        }

        setColumns(prev => ({ ...prev, [id]: c }))

    }

    const colChange = (e) => {
        let c = { ...columns[e.target.id], [e.target.name]: e.target.value }
        setColumns(prev => ({ ...prev, [e.target.id]: c }))
        setError('');
    }

    const tableChange = (e) => {
        setTableData(prev => ({ ...prev, [e.target.name]: e.target.value }))
        setError('');
    }

    const onRemove = (id) => {
        let c = { ...columns };
        delete c[id];
        setColumns(c);
    }

    const getNextId = () => {
        let keys = Object.keys(columns)
        let count = keys.length;
        if (count > 0) count = columns[keys[count - 1]].id + 1;
        while (columns.hasOwnProperty(count)) {
            count++;
        }

        return count
    }

    const onSubmit = async () => {

        //valid table input
        if (tableData.name.trim() === '') {
            setError('A table name required');
            return;
        }

        //valid column input
        Object.keys(columns).forEach(col => {
            let val = columns[col]?.name?.trim()
            if (val === undefined || val === '') {
                setError('All columns must have a name');
                return
            }
        });

        //insert table data
        let tb = {
            name: tableData.name,
            description: tableData.desc,
            num_columns: Object.keys(columns).length,
            user_id: user.id
        }

        const { data: res, error: er } = await supabaseClient
            .from('user_tables')
            .insert([tb])

        if (er) {
            setError(er.message);
            return
        }

        console.log('created table res: ', res);

        if (res) {

            //columns
            let colId = res[0].id;
            let payload = [];

            //compulsary column
            let pcomp = {
                name: 'Id',
                type: 'text',
                table_id: colId,
                default_value: 'Auto Increment',
                position: -1,
                author: user.id
            }

            payload.push(pcomp);

            Object.keys(columns).forEach(key => {
                let p = {
                    name: columns[key].name,
                    type: 'text',
                    table_id: colId,
                    default_value: columns[key].default,
                    position: key,
                    author: user.id
                }

                payload.push(p);
            })

            const { data: res2, error: er2 } = await supabaseClient
                .from('table_columns')
                .insert(payload)



            if (er2) {
                setError(er2.message);
                console.log('payload: ', payload)
                return
            }

            if (res2) {
                onCancel();
                router.reload(window.location.pathname);
                //console.log('created column res: ', res2);
            }

        }


    }

    return (
        <div className={styles.container} >
            <div className={styles.card} >
                <div className={styles.cardHeading}>
                    <p className={styles.cardHeadingText}>
                        Create Table
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
                border-color p-4 ml-4" >

                    <div className={styles.inputContainer}>
                        <label htmlFor="name">Name</label>
                        <input onChange={tableChange} type="text" name='name' id="name" autoComplete="off" />
                    </div>

                    <div className={styles.inputContainer}>
                        <label htmlFor="desc">Description</label>
                        <input onChange={tableChange} type="text" name='desc' id="desc" autoComplete="off" />
                    </div>


                </div >

                <div className="flex-col border-t-1
                border-color p-4 ml-4 overflow-x-auto"  >
                    <p className="font-semibold text-lg">Columns</p>

                    <table className={styles.colTable}>
                        <thead>
                            <tr>
                                <th></th>
                                <th>Name</th>
                                <th>Type</th>
                                <th>Default Value</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr >
                                <td className={styles.rounded}>
                                    <TbMenu2 />
                                </td>
                                <td className={styles.fixedRow}>
                                    <input readOnly type="text" name="constant" value="id" />
                                </td >
                                <td className={styles.fixedRow}>
                                    <input readOnly type="text" name="constant" value="text" />
                                </td>
                                <td className={styles.fixedRow}>
                                    <input readOnly type="text" name="constant" value="Auto Increment" />
                                </td>
                                <td className={styles.unrounded}>
                                    <div className={styles.tableButton}>
                                        x
                                    </div>
                                </td>
                            </tr>

                            {
                                Object.keys(columns).map((key, index) => {
                                    return (
                                        <ColumnRow
                                            onChange={colChange}
                                            id={key}
                                            key={index}
                                            onRemove={onRemove}
                                            data={columns[key]}
                                        />
                                    )

                                })
                            }

                        </tbody>
                    </table>

                    <div className='mt-5'>
                        <Button
                            color="white"
                            bgColor={currentColor}
                            text="Add Column"
                            borderRadius="10px"
                            size="xs"
                            onClick={addColumn}
                        />
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

export default CreateTable;
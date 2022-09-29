import React, { useEffect, useState } from 'react';

import { Header } from '../../components'
import { withPageAuth, supabaseServerClient, getUser } from '@supabase/auth-helpers-nextjs';
import { TableContainer } from '../../CleanComponents'
import { useStateContext } from '../../contexts/ContextProvider';
import { useRouter } from 'next/router';
import { table } from '@syncfusion/ej2-react-grids';

const CustomTable = ({ data, user }) => {

    const { currentMode } = useStateContext();
    let router = useRouter();

    const [tableName, setTableName] = useState('');
    const [tableSchema, setTableSchema] = useState([]);
    const [tableData, setTableData] = useState([]);

    const onRowClick = (id) => {

    }


    useEffect(() => {
        if (user && data) {
            let result = data[0];
            let table_columns = result.table_columns;
            let temp_sch = [];

            //create table schema
            for (let col of table_columns) {
                let sch = {
                    field: col.name,
                    headerText: col.name,
                    width: '150px',
                    textAlign: 'center',
                    position: col.position,
                }
                temp_sch.push(sch);

            }

            //collate table data
            let data_array = Array(temp_sch.length);
            for (let col of table_columns) {
                for (let point of col.column_data) {
                    data_array[point.row_position] = { ...data_array[point.row_position], [col.name]: point.data }
                }
            }

            setTableName(result.name);
            setTableSchema(temp_sch);
            setTableData(data_array);

            console.log('data ', data_array);


        }
    }, [user, data])

    console.log('table data: ', data);

    return (
        <>
            {user && <div className="m-2 md:m-10 p-2 md:p-10 bg-white rounded-3xl dark:bg-secondary-dark-bg">
                <Header
                    title={tableName}
                    category="Table"
                />

                <TableContainer
                    headerData={tableSchema}
                    tableData={tableData}
                    borderColor={currentMode === 'Dark' ? "#25282d" : ''}
                    textColor={currentMode === 'Dark' ? "#e5e7eb" : ''}
                    headerTextColor={currentMode === 'Dark' ? "#e5e7eb" : ''}
                    darkHover={currentMode === 'Dark' ? true : false}
                    rowClick={onRowClick}
                />

            </div>}
        </>
    );
}

export const getServerSideProps = withPageAuth({
    redirectTo: '/signin',
    async getServerSideProps(ctx) {
        // Access the user object
        const { id } = ctx.query;
        const { data } = await supabaseServerClient(ctx)
            .from('user_tables')
            .select(`name, table_columns(*, column_data(*) )`)
            .eq('id', id)
        const { user } = await getUser(ctx);
        return { props: { user, data } }
    },
})

export default CustomTable;
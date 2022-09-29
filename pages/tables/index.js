import React, { useEffect, useState } from 'react';

import { ordersData, ordersGrid } from '../../data/dummy';
import { Header } from '../../components'
import { withPageAuth, supabaseServerClient, getUser } from '@supabase/auth-helpers-nextjs';
import { TableContainer } from '../../CleanComponents'
import { useStateContext } from '../../contexts/ContextProvider';
import { useRouter } from 'next/router';

import { Button } from '../../components';
import { CreateTable } from '../../CleanComponents';

const Tables = ({ data, user }) => {

    const { currentMode, currentColor } = useStateContext();
    const [addContext, setAddContext] = useState(false);

    const toggleAdd = () => {
        setAddContext(prev => !prev);
    }


    let tableSchema = [
        {
            field: 'id',
            headerText: 'Id',
            width: '150px',
            textAlign: 'center',
        },
        {
            field: 'name',
            headerText: 'Name',
            width: '150px',
            textAlign: 'center',
        },
        {
            field: 'description',
            headerText: 'Description',
            width: '150px',
            textAlign: 'center',
        },
        {
            field: 'num_rows',
            headerText: 'Number Of Rows',
            width: '150px',
            textAlign: 'center',
        },
        {
            field: 'num_columns',
            headerText: 'Number of Columns',
            width: '150px',
            textAlign: 'center',
        },
    ]

    let router = useRouter();

    const onRowClick = (id) => {
        router.push(`/tables/${id}`);
    }


    return (
        <>
            <div className="m-2 md:m-10 p-2 md:p-10 bg-white rounded-3xl dark:bg-secondary-dark-bg">
                <Header
                    title="Tables"
                    category="Page"
                />

                <div className='mb-5'>
                    <Button
                        color="white"
                        bgColor={currentColor}
                        text="Create Table"
                        borderRadius="10px"
                        size="sm"
                        onClick={toggleAdd}
                    />
                </div>

                {
                    data && tableSchema &&
                    <TableContainer
                        headerData={tableSchema}
                        tableData={data}
                        borderColor={currentMode === 'Dark' ? "#25282d" : ''}
                        textColor={currentMode === 'Dark' ? "#e5e7eb" : ''}
                        headerTextColor={currentMode === 'Dark' ? "#e5e7eb" : ''}
                        darkHover={currentMode === 'Dark' ? true : false}
                        rowClick={onRowClick}
                    />
                }



            </div>
            {addContext && <CreateTable user={user} onCancel={toggleAdd} />}
        </>
    );
}

export const getServerSideProps = withPageAuth({
    redirectTo: '/signin',
    async getServerSideProps(ctx) {
        // Access the user object
        const { data } = await supabaseServerClient(ctx)
            .from('user_tables')
            .select('*')
        const { user } = await getUser(ctx);
        return { props: { user, data } }
    },
})

export default Tables;
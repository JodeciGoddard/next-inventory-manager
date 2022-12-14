import {
    GridComponent,
    ColumnsDirective,
    ColumnDirective,
    Page,
    Search,
    Edit,
    Inject,
    Toolbar
} from "@syncfusion/ej2-react-grids";

import { employeesData, employeesGrid } from '../data/dummy';
import { Header } from '../components'


const Employees = () => {
    return (
        <div className="m-2 md:m-10 p-2 md:p-10 bg-white dark:bg-secondary-dark-bg rounded-3xl">
            <Header
                title="Employees"
                category="Page"
            />

            <GridComponent
                dataSource={employeesData}
                allowPaging
                toolbar={['Search']}
                width="auto"
            >
                <ColumnsDirective >
                    {employeesGrid.map((item, index) =>
                        <ColumnDirective key={index} {...item} />
                    )}
                </ColumnsDirective>
                <Inject services={[Page, Search, Edit, Toolbar]} />
            </GridComponent>
        </div>
    );
}

export default Employees;
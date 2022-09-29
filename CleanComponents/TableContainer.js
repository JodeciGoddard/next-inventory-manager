import React, { useEffect, useState } from 'react';
import styles from './css/TableContainer.module.css'


const CreateTableRow = ({ data, columnHeaders, textColor, borderColor, darkHover, onClick }) => {
    const cx = {
        color: textColor ? textColor : '',
        borderColor: borderColor ? borderColor : ''
    }
    return (
        <tr
            className={darkHover ? styles.darkHover : styles.lightHover}
            onClick={onClick}
        >
            {columnHeaders.map((header, index) => {

                if (header.template) {
                    return <td style={cx} key={index}> {header.template(data)} </td>
                }

                return (
                    <td style={cx} key={index}>
                        {data[header.field]}
                    </td>
                )
            })}
        </tr>
    )
}

const TableContainer = ({ tableData, headerData, cssClasses, borderColor, headerTextColor, textColor, darkHover, rowClick }) => {

    const cx = {
        borderColor: borderColor ? borderColor : '',
    }
    return (
        <div className={`${styles.container} `} style={cx}>

            <table>
                <thead>
                    <tr>
                        {
                            headerData && headerData.map(item => {
                                const s = {
                                    textAlign: item.textAlign ? item.textAlign : '',
                                    width: item.width ? item.width : 'auto',
                                    backgroundColor: borderColor ? borderColor : '',
                                    color: headerTextColor ? headerTextColor : ''
                                }
                                return (
                                    <th key={item.headerText} style={s} >
                                        {item.headerText}
                                    </th>
                                )
                            })
                        }
                    </tr>
                </thead>
                <tbody>
                    {
                        tableData.map((tbData, index) =>
                            <CreateTableRow
                                key={index}
                                data={tbData}
                                columnHeaders={headerData}
                                textColor={textColor}
                                borderColor={borderColor}
                                darkHover={darkHover}
                                onClick={() => { rowClick(tbData.id) }}
                            />
                        )
                    }
                </tbody>
            </table>

        </div>
    );
}

export default TableContainer;
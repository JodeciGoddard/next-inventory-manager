import React, { useEffect, useState } from 'react';
import styles from './css/TableContainer.module.css'
import { BiEdit } from 'react-icons/bi';


const CreateTableRow = ({ data, columnHeaders, textColor, borderColor, darkHover, onClick, editable, onEdit }) => {
    const cx = {
        color: textColor ? textColor : '',
        borderColor: borderColor ? borderColor : ''
    }
    return (
        <tr
            className={darkHover ? styles.darkHover : styles.lightHover}
        >
            {
                editable ? <td onClick={() => onEdit(data)} className={styles.edit}><BiEdit /></td> : null
            }
            {columnHeaders.map((header, index) => {
                if (header.template) {
                    return <td style={cx} key={index} onClick={onClick}> {header.template(data)} </td>
                }

                return (
                    <td style={cx} key={index} onClick={onClick}>
                        {data[header.field]}
                    </td>
                )
            })}
        </tr>
    )
}

const TableContainer = ({ tableData, headerData, cssClasses, borderColor, headerTextColor, textColor, darkHover, rowClick, editable, onEdit }) => {

    const cx = {
        borderColor: borderColor ? borderColor : '',
    }
    return (
        <div className={`${styles.container} `} style={cx}>

            <table>
                <thead>
                    <tr>
                        {
                            editable ? <th style={{ width: '50px', textAlign: 'center' }}>Edit</th> : null
                        }
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
                                editable={editable}
                                onEdit={onEdit}
                            />
                        )
                    }
                </tbody>
            </table>

        </div>
    );
}

export default TableContainer;
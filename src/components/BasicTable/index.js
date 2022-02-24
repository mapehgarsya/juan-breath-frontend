import React, { useMemo } from 'react'
// import package/s
import { useTable, useSortBy } from 'react-table'
import { FaPen, FaTrash, FaQrcode, FaArrowDown, FaArrowUp } from "react-icons/fa";


function BasicTable ({columnHeads, tableData, hasDelete, hasEdit, hasQR, editModalFunction, deleteModalFunction, qrModalFunction}) {

    const columns = useMemo(() => columnHeads, [columnHeads])
    const data = useMemo(() => tableData, [tableData])

    const tableInstance = useTable({
        columns,
        data
    }, useSortBy)

    const { 
        getTableProps, 
        getTableBodyProps,
        headerGroups, 
        rows, 
        prepareRow
    } = tableInstance

    const convertTo112HourFormat = time => {
        // Check correct time format and split into components
        time = time.toString().match(/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];

        if (time.length > 1) {
        // If time format correct
        time = time.slice(1); // Remove full string match value
        time[5] = +time[0] < 12 ? ' AM' : ' PM'; // Set AM/PM
        time[0] = +time[0] % 12 || 12; // Adjust hours
        }
        return time.join('');
    };

    return (
        <div className='customTableDiv'>
            {
                <table className='tableStyle' {...getTableProps()}>
                    <thead>
                        {headerGroups.map((headerGroup) => (
                            <tr {...headerGroup.getHeaderGroupProps()}>
                                {headerGroup.headers.map((column) => (
                                    <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                                        {column.render('Header')}
                                        <span>
                                            {column.isSorted ? (column.isSortedDesc ? <FaArrowDown className='ml-5'/> : <FaArrowUp className='ml-5'/>) : ''}
                                        </span>
                                    </th>
                                ))}
                            </tr>
                        ))}
                    </thead>
                    <tbody {...getTableBodyProps()}>
                        {
                            // this section renders the data inside an array
                            tableData && rows.map((row, i) => {
                                prepareRow(row)
                                return (
                                    <tr {...row.getRowProps()}>
                                        {row.cells.map((cell) => {
                                            if(cell.column.Header === "No.") {
                                                return <tr>
                                                    <td>{i + 1}</td>
                                                </tr>
                                            }

                                            if(cell.column.Header === "Faculty Name") {
                                                return <tr>
                                                    <td>{cell.row.original.firstName + " " + cell.row.original.middleName?.toUpperCase() + ". " + cell.row.original.lastName}</td>
                                                </tr>
                                            }

                                            if(cell.column.Header === "Users Contact No.") {
                                                return <td>{cell.row.original.userId.mobileNumber}</td>
                                            }

                                            if(cell.column.Header === "Date") {
                                                return <td>{cell.row.original.date}</td>
                                            }

                                            if(cell.column.Header === "Time") {
                                                return <td>{convertTo112HourFormat(cell.row.original.time)}</td>
                                            }

                                            if(cell.column.Header === "Registration Date") {
                                                return <td>{cell.row.original.createdAt.split('T')[0]}</td>
                                            }

                                            if(cell.column.Header === "Action") {
                                                return <td className={cell.row.original.action === "Scanned the QR Code" ? 'entry' : 'exit' } >{cell.row.original.action}</td>
                                            }
                                            
                                            if(cell.column.Header === "Date Created" || cell.column.Header === "Date") {
                                                return <td>{cell.row.original.createdAt?.split('T')[0]}</td>   
                                            }

                                            // note you can merge this line of code even further
                                            if (cell.column.Header==='Actions' && hasEdit && hasDelete && !hasQR) {
                                                return <td className='iconBtnWrapper'>
                                                    <button className='iconBtn mr-10' title="Edit">
                                                        <FaPen 
                                                            color="#2a749f"
                                                            onClick={() => editModalFunction(cell.row.original?._id)}
                                                        />
                                                    </button>
                                                    <button className='iconBtn' title="Delete">
                                                        <FaTrash 
                                                            color='red'
                                                            onClick={() => deleteModalFunction(cell.row.original?._id)}
                                                        />
                                                    </button>
                                                </td>
                                            }
                                            else if (cell.column.Header==='Actions' && hasEdit && hasDelete && hasQR) {
                                                return <td className='iconBtnWrapper'>
                                                    <button className='iconBtn mr-10' title="QR Code">
                                                        <FaQrcode 
                                                            color="black"
                                                            onClick={() => qrModalFunction(cell.row.original?._id)}
                                                        />
                                                    </button>
                                                    <button className='iconBtn mr-10' title="Edit">
                                                        <FaPen 
                                                            color="#2a749f"
                                                            onClick={() => editModalFunction(cell.row.original?._id)}
                                                        />
                                                    </button>
                                                    <button className='iconBtn' title="Delete">
                                                        <FaTrash 
                                                            color='red'
                                                            onClick={() => deleteModalFunction(cell.row.original?._id)}
                                                        />
                                                    </button>
                                                </td>
                                            }
                                            return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                                        })
                                            
                                        }
                                        
                                    </tr>
                                )
                            })
                        }
                        {
                            tableData.length === 0 && <tr><td>No data to be displayed at the moment</td></tr>
                        }
                    </tbody>
                </table>
            }
        </div>
        
    )
}

export default BasicTable

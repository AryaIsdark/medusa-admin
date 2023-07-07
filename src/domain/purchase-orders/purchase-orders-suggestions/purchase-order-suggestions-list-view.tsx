import { Column } from "@tanstack/react-table"
import Table from "../../../components/molecules/table"
import { useTable } from "react-table"
import api from "../../../services/api"
import { useEffect, useState } from "react"

const columns = [
  {
    Header: "Product Reference",
    accessor: "productReference",
    Cell: ({ cell: { value } }) => value,
  },
  {
    Header: "Product Quantity",
    accessor: "productQuantity",
    Cell: ({ cell: { value } }) => value,
  },
  {
    Header: "Product Name",
    accessor: "productName",
    Cell: ({ cell: { value } }) => value,
  },
]

export const PurchaseOrdersSuggestionsListView = () => {
  const [data, setData] = useState([])

  const { rows, prepareRow } = useTable({
    data: data,
    columns: columns,
  })

  const getData = async () => {
    console.log("I ran")
    await api.wmsPurchaseOrderSuggestions.list().then((res) => {
      setData(res.data.data)
    })
  }

  useEffect(() => {
    getData()
  }, [])

  if (!data?.length) {
    return null
  }

  return (
    <>
      <Table>
        <Table.Head title="Table Head">
          {columns.map((column) => (
            <Table.HeadCell>{column.Header}</Table.HeadCell>
          ))}
        </Table.Head>
        <Table.Body>
          {rows.map((row) => {
            prepareRow(row)
            return (
              <Table.Row>
                {row.cells.map((cell, index) => {
                  return (
                    <Table.Cell {...cell.getCellProps()}>
                      {cell.render("Cell", { index })}
                    </Table.Cell>
                  )
                })}
              </Table.Row>
            )
          })}
        </Table.Body>
      </Table>
    </>
  )
}

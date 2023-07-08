import Table from "../../../components/molecules/table"
import BodyCard from "../../../components/organisms/body-card"
import { useTable } from "react-table"
import api from "../../../services/api"
import { useEffect, useState } from "react"
import * as XLSX from "xlsx"
import Button from "../../../components/fundamentals/button"

const exportPurchaseOrders = (jsonData) => {
  const rearrangedData = jsonData.map((item) => ({
    productReference: item.productReference,
    productQuantity: item.productQuantity,
    productName: item.productName,
  }))
  // Create a new workbook
  const workbook = XLSX.utils.book_new()

  // Convert JSON to worksheet
  const worksheet = XLSX.utils.json_to_sheet(rearrangedData)

  // Add the worksheet to the workbook
  XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1")

  // Save the workbook as a file
  XLSX.writeFile(workbook, "purchase-order.xlsx")
}

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
  {
    Header: "Stock",
    accessor: "stock",
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
    <div className="flex h-full grow flex-col">
      <div className="flex w-full grow flex-col">
        <BodyCard
          title="Purchase Order Suggestion"
          subtitle="Here you can see a suggested list of purchase order based on previous day's orders"
          className="h-fit"
          customActionable={[
            <Button
              variant="primary"
              size="small"
              onClick={() => exportPurchaseOrders(data)}
            >
              Export Purchase Orders
            </Button>,
          ]}
        >
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
        </BodyCard>
      </div>
    </div>
  )
}

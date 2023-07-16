import { useTable, usePagination } from "react-table"
import Table from "../../../components/molecules/table"
import { useState } from "react"
import { TablePagination } from "../../../components/organisms/table-container/pagination"

const LIMIT = 20

const columns = [
  {
    Header: "Reference / SKU",
    accessor: "reference",
    Cell: ({ cell: { value } }) => value,
  },
  {
    Header: "Combination Reference",
    accessor: "combinationReference",
    Cell: ({ cell: { value } }) => value,
  },
  {
    Header: "Product Name",
    accessor: "productName",
    Cell: ({ cell: { value } }) => value,
  },
  {
    Header: "Atrribute Group Name",
    accessor: "attributeGroup",
    Cell: ({ cell: { value } }) => value,
  },
  {
    Header: "price",
    accessor: "price",
    Cell: ({ cell: { value } }) => value,
  },
  {
    Header: "Combination Price",
    accessor: "combinationPrice",
    Cell: ({ cell: { value } }) => value,
  },
]

export const ImportPorductsTable = ({ data }) => {
  const [offset, setOffset] = useState(0)
  const initialState = {
    pageSize: LIMIT,
    pageIndex: 0,
  }

  const {
    getTableProps,
    getTableBodyProps,
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    pageCount,
    nextPage,
    previousPage,

    state: { pageIndex, pageSize },
  } = useTable(
    {
      columns,
      data,
      initialState,
      pageCount: Math.ceil(data.length || 0 / LIMIT),
    },
    usePagination
  )

  const handleNext = () => {
    if (canNextPage) {
      setOffset(offset + LIMIT)
      nextPage()
    }
  }

  const handlePrev = () => {
    if (canPreviousPage) {
      setOffset(offset - LIMIT)
      previousPage()
    }
  }

  return (
    <>
      <Table {...getTableProps()}>
        <Table.Head title="Table Head">
          {columns.map((column) => (
            <Table.HeadCell>{column.Header}</Table.HeadCell>
          ))}
        </Table.Head>
        <Table.Body {...getTableBodyProps()}>
          {page.map((row) => {
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

      <div className="mt-14">
        <TablePagination
          pagingState={{
            count: data.length,
            offset: offset,
            pageSize: LIMIT,
            title: "Products",
            currentPage: pageIndex + 1,
            pageCount: pageCount,
            nextPage: handleNext,
            prevPage: handlePrev,
            hasNext: canNextPage,
            hasPrev: canPreviousPage,
          }}
        />
      </div>
    </>
  )
}

import Table from "../../../components/molecules/table"
import BodyCard from "../../../components/organisms/body-card"
import { useTable } from "react-table"
import api from "../../../services/api"
import { useEffect, useState } from "react"

const columns = [
  {
    Header: "Entity",
    accessor: "entity_id",
    Cell: ({ cell: { value } }) => value,
  },
  {
    Header: "Error",
    accessor: "error",
    Cell: ({ cell: { value } }) => value,
  },
  {
    Header: "Date",
    accessor: "created_at",
    Cell: ({ cell: { value } }) => value,
  },
]

export const ErrorLogsListView = () => {
  const [data, setData] = useState([])

  const { rows, prepareRow } = useTable({
    data: data,
    columns: columns,
  })

  const getData = async () => {
    await api.errorLogs.list().then((res) => {
      setData(res.data.data)
    })
  }

  useEffect(() => {
    getData()
  }, [])

  return (
    <div className="flex h-full grow flex-col">
      <div className="flex w-full grow flex-col">
        <BodyCard
          title="Logs"
          subtitle="Here you can see logs"
          className="h-fit"
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

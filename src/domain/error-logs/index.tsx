import { Route, Routes } from "react-router-dom"
import { ErrorLogsListView } from "./list/error-logs-list-view"

const ErrorLogsIndex = () => {
  return <ErrorLogsListView />
}

const ErrorLogs = () => {
  return (
    <Routes>
      <Route index element={<ErrorLogsIndex />} />
    </Routes>
  )
}

export default ErrorLogs

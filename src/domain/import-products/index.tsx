import { Route, Routes } from "react-router-dom"
import { ImportProductsView } from "./views/import-products-view"

const ImportProductsIndex = () => {
  return <ImportProductsView />
}

const ImportProducts = () => {
  return (
    <Routes>
      <Route index element={<ImportProductsIndex />} />
    </Routes>
  )
}

export default ImportProducts

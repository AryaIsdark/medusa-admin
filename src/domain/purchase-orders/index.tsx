import { Route, Routes } from "react-router-dom"
import "./style.css"
import { PurchaseOrdersSuggestionsListView } from "./purchase-orders-suggestions/purchase-order-suggestions-list-view"

const PurchaseOrderIndex = () => {
  return <PurchaseOrdersSuggestionsListView />
}

const PurchaseOrders = () => {
  return (
    <Routes>
      <Route index element={<PurchaseOrderIndex />} />
    </Routes>
  )
}

export default PurchaseOrders

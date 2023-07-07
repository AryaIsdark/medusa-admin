import { Route, Routes } from "react-router-dom"
import "./style.css"
import { PurchaseOrdersSuggestionsListView } from "./purchase-orders-suggestions/purchase-order-suggestions-list-view"
import BodyCard from "../../components/organisms/body-card"

const PurchaseOrderIndex = () => {
  return (
    <div className="flex h-full grow flex-col">
      <div className="flex w-full grow flex-col">
        <BodyCard
          title="Purchase Order Suggestion"
          subtitle="Here you can see a suggested list of purchase order based on previous day's orders"
          className="h-fit"
        >
          <PurchaseOrdersSuggestionsListView />
        </BodyCard>
      </div>
    </div>
  )
}

const PurchaseOrders = () => {
  return (
    <Routes>
      <Route index element={<PurchaseOrderIndex />} />
    </Routes>
  )
}

export default PurchaseOrders

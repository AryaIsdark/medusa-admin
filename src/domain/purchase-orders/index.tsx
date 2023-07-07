import { Route, Routes } from "react-router-dom"
import * as Tabs from "@radix-ui/react-tabs"
import "./style.css"
import { PurchaseOrdersSuggestionsListView } from "./purchase-orders-suggestions/purchase-order-suggestions-list-view"

const PurchaseOrderIndex = () => {
  return (
    <Tabs.Root className="TabsRoot" defaultValue="purchaseOrdersTab">
      <Tabs.List className="TabsList" aria-label="Purchase Orders">
        <Tabs.Trigger className="TabsTrigger" value="purchaseOrdersTab">
          Purchase Orders
        </Tabs.Trigger>
        <Tabs.Trigger
          className="TabsTrigger"
          value="purchaseOrdersSuggestionsTab"
          aria-label="Purchase Orders Suggestions"
        >
          Suggestions
        </Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content className="TabsContent" value="purchaseOrdersTab">
        <p className="Text">Here you will see the existing purchase orders</p>
      </Tabs.Content>
      <Tabs.Content
        className="TabsContent"
        value="purchaseOrdersSuggestionsTab"
      >
        <p className="Text">
          Here you will see the existing purchase orders suggestions
        </p>
        <div>
          <PurchaseOrdersSuggestionsListView />
        </div>
      </Tabs.Content>
    </Tabs.Root>
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

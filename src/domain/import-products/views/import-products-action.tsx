import Button from "../../../components/fundamentals/button"
import ArrowLeftIcon from "../../../components/fundamentals/icons/arrow-left-icon"

export const ImportProductsActions = ({ onCancel, onAddProducts }) => {
  return (
    <div className="flex space-x-2">
      <Button size="small" variant="ghost" onClick={onCancel}>
        <ArrowLeftIcon />
        Cancel
      </Button>
      <Button variant="primary" size="small" onClick={onAddProducts}>
        Start Syncing
      </Button>
    </div>
  )
}

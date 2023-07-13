import { useEffect, useState } from "react"
import FileUploadField from "../../../components/atoms/file-upload-field"
import api from "../../../services/api"
import Button from "../../../components/fundamentals/button"
import { LoaderIcon } from "react-hot-toast"
import BodyCard from "../../../components/organisms/body-card"
import { ImportPorductsTable } from "./import-products-table"
import { ImportProductsActions } from "./import-products-action"
import useNotification from "../../../hooks/use-notification"

export const updatePriceByPercentage = (currentPrice, percentage) =>
  ((percentage / currentPrice) * 100 + currentPrice).toFixed(2)

export const ImportProductsView = () => {
  const [loading, setLoading] = useState(false)
  const [processingFile, setProcessingFile] = useState(false)
  const [shouldPoll, setShouldPoll] = useState(false)
  const [validationErrors, setValidationErrors] = useState([])
  const [products, setProducts] = useState([])
  const [productsFromFile, setProductsFromFile] = useState([])
  const [file, setFile] = useState()
  const notifitation = useNotification()

  const loadProducts = () => {
    setLoading(true)
    api.supplierProduct.list().then((res) => {
      setLoading(false)
      setProducts(res.data.data)
    })
  }

  const handleAddProducts = () => {
    api.supplierProduct.bulkCreate(file).then((res) => {
      notifitation("Good Job!", "Products were added to the system", "success")
      setProductsFromFile([])
      loadProducts()
      setShouldPoll(true)
    })
  }

  const handleFileUpload = (files) => {
    setShouldPoll(false)
    setProcessingFile(true)
    api.productSync
      .upload(files[0])
      .then((res) => {
        console.log(res)
        const prodcutsFromServer = res.data.data
        console.log(prodcutsFromServer)
        setProductsFromFile(prodcutsFromServer)
        setFile(files[0])
      })
      .catch((err) => {
        const validationErrorsFromServer = err?.response?.data?.validationErrors
        if (validationErrorsFromServer) {
          setValidationErrors(validationErrorsFromServer)
          setProcessingFile(false)
        }
      })
      .finally(() => {
        setProcessingFile(false)
      })
  }

  const handleBulkDelete = () => {
    setLoading(true)
    api.supplierProduct.bulkDelete().then((res) => {
      loadProducts()
      setLoading(false)
    })
  }

  useEffect(() => {
    const fetchData = async () => {
      loadProducts()
    }
    fetchData()
    if (shouldPoll) {
      // Start polling every 3 seconds (adjust the interval as needed)
      const intervalId = setInterval(fetchData, 3000)
      // Stop polling after 10 seconds
      const timeoutId = setTimeout(() => {
        clearInterval(intervalId)
      }, 10000)

      // Clean up the interval and timeout when the component unmounts
      return () => {
        clearInterval(intervalId)
        clearTimeout(timeoutId)
      }
    }

    // Clean up the interval when the component unmounts
  }, [shouldPoll])

  if (processingFile) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100%",
        }}
      >
        <div style={{ alignItems: "center" }}>
          <LoaderIcon
            style={{ height: "40px", width: "40px", margin: "0 auto" }}
          />
          <p> Processing the file, Please be patient...</p>
        </div>
      </div>
    )
  }

  if (!validationErrors.length && productsFromFile.length) {
    return (
      <BodyCard
        title={`${productsFromFile.length} Products`}
        subtitle="Here you can see a list of products that were found in the file"
        className="h-fit"
        customActionable={
          <ImportProductsActions
            onCancel={() => setProductsFromFile([])}
            onAddProducts={handleAddProducts}
          />
        }
      >
        <ImportPorductsTable data={productsFromFile} />
      </BodyCard>
    )
  }

  if (validationErrors.length) {
    return (
      <>
        <Button
          type="button"
          variant="secondary"
          onClick={() => setValidationErrors([])}
        >
          Back
        </Button>
        <h1>
          The File you have uploaded has {validationErrors.length} validation
          errors. Consider fixing them and re-upload the fixed file
        </h1>
        <br />

        <div style={{ marginBottom: "20px" }}>
          {validationErrors.map((error: any) => (
            <div
              style={{
                marginBottom: "20px",
                border: "1px solid red",
                padding: "10px",
                background: "#ffd4d4",
                borderRadius: "5px",
              }}
            >
              <div>
                <b>{error.row.Product}</b>
              </div>
              {error.errors.map((rowError) => (
                <>
                  <div>
                    Column: <b>{rowError.key}</b>
                  </div>
                  <div>
                    Error Message: <b>{rowError.message}</b>
                  </div>
                </>
              ))}
            </div>
          ))}
        </div>
      </>
    )
  }

  return (
    <>
      <div
        className="mb-5"
        style={{
          height: "15vh",
          background: "#b7b7b738",
          padding: "10px",
          textAlign: "center",
        }}
      >
        <FileUploadField
          text={"Drop/Browse latest file from supplier To Sync products"}
          onFileChosen={handleFileUpload}
          filetypes={["xlsx"]}
        />
      </div>
      <BodyCard
        title={`${products.length} Products`}
        subtitle="These are products from the supplier that are currently saved in our DB"
        className="h-fit"
        customActionable={
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            {loading && <LoaderIcon />}
            {!!products.length && (
              <Button
                disabled={loading}
                variant="nuclear"
                size="small"
                onClick={handleBulkDelete}
              >
                Delete (1000 Rows)
              </Button>
            )}
          </div>
        }
      >
        {!!products.length && <ImportPorductsTable data={products} />}
        {!products.length && !loading && (
          <>Currently there are no products added in the supplier database</>
        )}
      </BodyCard>
    </>
  )
}

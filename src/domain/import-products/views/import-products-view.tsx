import { useEffect, useState } from "react"
import FileUploadField from "../../../components/atoms/file-upload-field"
import api from "../../../services/api"
import Button from "../../../components/fundamentals/button"
import { LoaderIcon } from "react-hot-toast"
import BodyCard from "../../../components/organisms/body-card"
import { ImportPorductsTable } from "./import-products-table"
import { ImportProductsActions } from "./import-products-action"

export const updatePriceByPercentage = (currentPrice, percentage) =>
  ((percentage / currentPrice) * 100 + currentPrice).toFixed(2)

export const ImportProductsView = () => {
  const [loading, setLoading] = useState(false)
  const [loadingProducts, setLoadingProducts] = useState(false)
  const [validationErrors, setValidationErrors] = useState([])
  const [products, setProducts] = useState([])
  const [productsFromFile, setProductsFromFile] = useState([])
  const [file, setFile] = useState()

  const handleAddProducts = () => {
    console.log(file)
    api.supplierProduct.bulkCreate(file).then((res) => {
      console.log(res)
    })
    // .bulkCreate(products)
    // .then((res) => {
    //   console.log(res)
    // })
    // .catch((err) => {
    //   console.log(err)
    // })
  }

  const handleFileUpload = (files) => {
    setLoading(true)
    api.productSync
      .upload(files[0])
      .then((res) => {
        console.log(res)
        const prodcutsFromServer = res.data.data
        console.log(prodcutsFromServer)
        setProductsFromFile(prodcutsFromServer)
        setLoading(false)
        setFile(files[0])
      })
      .catch((err) => {
        const validationErrorsFromServer = err?.response?.data?.validationErrors
        if (validationErrorsFromServer) {
          setValidationErrors(validationErrorsFromServer)
          setLoading(false)
        }
      })
      .finally(() => {
        setLoading(false)
      })
  }

  useEffect(() => {
    setLoadingProducts(true)
    api.supplierProduct.list().then((res) => {
      setLoadingProducts(false)
      setProducts(res.data.data)
    })
  }, [])

  if (loading) {
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
      >
        {products.length && <ImportPorductsTable data={products} />}
        {!products.length && !loadingProducts && (
          <>Currently there are no products added in the supplier database</>
        )}
      </BodyCard>
    </>
  )
}

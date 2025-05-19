import { useParams } from "react-router-dom"
import { dummyProducts } from "../assets/assets"
import ProductCard from "../components/ProductCard"

const ProductCategory = () => {
    const params = useParams()
    const category = params.category;
    const productCategory = dummyProducts.filter(pro => pro.category.toLowerCase() === category);
    return (
        <div className="grid grid-cols-2 lg:grid-cols-5 md:grid-cols-4 gap-4 ">
            {
                productCategory.map((product, index) => {
                    return (
                        <ProductCard product={product} key={index} />
                    )
                })
            }
        </div>
    )
}
export default ProductCategory
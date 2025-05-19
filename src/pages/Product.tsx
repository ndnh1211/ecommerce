import { dummyProducts } from "../assets/assets"
import ProductCard from "../components/ProductCard"


const Product = () => {
    return (
        <div className="grid grid-cols-2 lg:grid-cols-5 md:grid-cols-4 gap-4 ">
            {
                dummyProducts.map((product, index) => {
                    return (
                        <ProductCard product={product} key={index} />
                    )
                })
            }

        </div>
    )
}

export default Product
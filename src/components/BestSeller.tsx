import Title from "./Title"
import { dummyProducts } from "../assets/assets"
import ProductCard from "./ProductCard"
import { useTranslation } from "react-i18next"
const BestSeller = () => {
    const { t } = useTranslation()
    return (
        <Title title={t(`home.bestSeller`)}>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 mt-6 gap-6">
                {
                    dummyProducts
                        .filter(pro => pro.inStock && pro.rating >= 4)
                        .slice(0, 5)
                        .map((pro, index) => (
                            <ProductCard key={`productCard-${index}`} product={pro} />
                        ))
                }
            </div>
        </Title>

    )
}
export default BestSeller
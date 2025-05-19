
import Title from "./Title";
import { categories } from "../assets/assets";
import CategoryCard from "./CategoryCard";
import { useTranslation } from "react-i18next";

const Category = () => {
    const { t } = useTranslation();
    return (
        <Title title={t(`home.categories.title`)}>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 mt-6 gap-6">
                {
                    categories.map((categorory, index) => {
                        return (
                            <CategoryCard key={`category-${index}`} category={categorory} />
                        )
                    })
                }
            </div>
        </Title>

    )
}
export default Category
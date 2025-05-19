import { useNavigate } from "react-router-dom"
import { cn } from "../lib/utils"
import { useTranslation } from "react-i18next"

interface Props {
    category: categoryType
}
const CategoryCard = ({ category }: Props) => {
    const navigate = useNavigate()
    const { t } = useTranslation()
    return (
        <div className="group cursor-pointer pt-5 px-3 gap-2 rounded-lg flex flex-col justify-cent items-center" style={{ backgroundColor: category.bgColor }}
            onClick={() => { navigate(`/product/${category.path.toLowerCase()}`) }}
        >
            <img src={category.image} alt={category.text} loading="lazy" className={cn(
                "group-hover:scale-110 transition max-w-28"
            )} />
            <p className="text-sm font-medium text-black">{t(`home.categories.${category.path}`)}</p>
        </div>
    )
}
export default CategoryCard
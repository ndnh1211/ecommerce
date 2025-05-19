
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAppContext } from "../context/AppContext";

const ProductCard = ({ product }: { product: ProductType }) => {
    const navigate = useNavigate();
    const { t } = useTranslation()
    const { addToCart, minusFromCart, cartItems } = useAppContext()

    return (
        <div onClick={() => navigate(`/product/${product.category.toLowerCase()}/${product._id}`)} className="border border-gray-500/20 rounded-md md:px-4 px-3 py-2 bg-white max-w-56 w-full">
            <div className="group cursor-pointer flex items-center justify-center px-2">
                <img className="group-hover:scale-105 transition max-w-26 md:max-w-36" src={product.image[0]} alt={product.name} />
            </div>
            <div className="text-gray-500/60 text-sm">
                <p>{t(`categories.${product.category}`)}</p>
                <p className="text-gray-700 font-medium text-lg truncate w-full">{product.name}</p>
                <div className="flex items-center gap-0.5">
                    {Array(5).fill('').map((_, i) => (
                        product.rating > i ? (
                            <img src={assets.star_icon} alt="Star" className="size-4" />
                        ) : (
                            <img src={assets.star_dull_icon} alt="Star" className="size-4" />)
                    ))}
                    <p>({product.rating})</p>
                </div>
                <div className="flex flex-col mt-3">
                    <p className="md:text-xl text-base font-medium text-primary">
                        {product.offerPrice?.toLocaleString()}VND <span className="text-gray-500/60 md:text-sm text-xs line-through">{product.price?.toLocaleString()}VND</span>
                    </p>
                    <div onClick={(e) => e.stopPropagation()} className="text-primary ml-auto">
                        {!cartItems[product._id] ? (
                            <button className="flex items-center justify-center gap-1 bg-primary/30 border border-primary/50 md:w-[80px] w-[64px] h-[34px] rounded text-primary font-medium" onClick={() => { addToCart(product._id) }} >
                                <img src={assets.cart_icon} alt="Cart" className="size-4" />
                                {t(`action.add`)}
                            </button>
                        ) : (
                            <div className="flex items-center justify-center gap-2 md:w-20 w-16 h-[34px] bg-primary/25 rounded select-none">
                                <button onClick={() => { minusFromCart(product._id) }} className="cursor-pointer text-md px-2 h-full" >
                                    -
                                </button>
                                <span className="w-5 text-center">{cartItems[product._id]}</span>
                                <button onClick={() => { addToCart(product._id) }} className="cursor-pointer text-md px-2 h-full" >
                                    +
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
export default ProductCard;
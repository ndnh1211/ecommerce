import { useCallback, useEffect, useState } from "react";
import { assets, dummyProducts } from "../assets/assets";
import { useTranslation } from "react-i18next";
import { useAppContext } from "../context/AppContext";
interface ProductExtend extends ProductType {
    quantity?: number;
}
const Cart = () => {
    const { t } = useTranslation()
    const [showAddress, setShowAddress] = useState(false)
    const { cartItems, getCartAmount, removeFromCart } = useAppContext()
    const [cartArr, setCartArr] = useState<ProductExtend[]>([])
    const getCart = useCallback(() => {
        const arr = [];
        for (const key in cartItems) {
            const product = dummyProducts.find(pro => pro._id === key);
            if (product) {
                const productData: ProductExtend = structuredClone(product);
                productData.quantity = cartItems[key]
                arr.push(productData);
            }
        }
        setCartArr(arr);
    }, [cartItems])
    useEffect(() => {
        if (cartItems) {
            getCart()
        }
    }, [getCart, cartItems])
    return (
        <div className="flex flex-col md:flex-row py-16 max-w-6xl w-full px-6 mx-auto">
            <div className='flex-1 max-w-4xl'>
                <h1 className="text-3xl font-medium mb-6">
                    {t(`cart.title`)} <span className="text-sm text-primary">3 {t(`cart.items`)}</span>
                </h1>

                <div className="grid grid-cols-[2fr_1fr_1fr] text-gray-500 text-base font-medium pb-3">
                    <p className="text-left">{t(`cart.productDetail`)}</p>
                    <p className="text-center">{t(`cart.subtotal`)}</p>
                    <p className="text-center">{t(`cart.action`)}</p>
                </div>

                {cartArr.map((product, index) => (
                    <div key={index} className="grid grid-cols-[2fr_1fr_1fr] text-gray-500 items-center text-sm md:text-base font-medium pt-3">
                        <div className="flex items-center md:gap-6 gap-3">
                            <div className="cursor-pointer w-24 h-24 flex items-center justify-center border border-gray-300 rounded">
                                <img className="max-w-full h-full object-cover" src={product.image[0]} alt={product.name} />
                            </div>
                            <div>
                                <p className="hidden md:block font-semibold">{product.name}</p>
                                <div className="font-normal text-gray-500/70">
                                    <p>{t(`cart.size`)}: <span>{product?.weight || "N/A"}</span></p>
                                    <div className='flex items-center'>
                                        <p>{t(`cart.qty`)}: <span>{product.quantity}</span></p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <p className="text-center">{Number(product.offerPrice * (product?.quantity || 1)).toLocaleString()}VND</p>
                        <button onClick={() => { removeFromCart(product._id) }} className="cursor-pointer mx-auto">
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="m12.5 7.5-5 5m0-5 5 5m5.833-2.5a8.333 8.333 0 1 1-16.667 0 8.333 8.333 0 0 1 16.667 0" stroke="#FF532E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </button>
                    </div>)
                )}

                <button className="group cursor-pointer flex items-center mt-8 gap-2 text-primary font-medium">
                    <img src={assets.arrow_right_icon_colored} alt="right" className="group-hover:-translate-x-1 transition" />
                    {t(`action.continue`)}
                </button>

            </div>

            <div className="max-w-[360px] w-full bg-gray-100/40 p-5 max-md:mt-16 border border-gray-300/70 rounded-md shadow-md">
                <h2 className="text-xl md:text-xl font-medium">{t(`cart.summary`)}</h2>
                <hr className="border-gray-300 my-5" />

                <div className="mb-6">
                    <p className="text-sm font-medium uppercase">{t(`cart.delivery`)}</p>
                    <div className="relative flex justify-between items-start mt-2">
                        <p className="text-gray-500">{t(`cart.noAddress`)}</p>
                        <button onClick={() => setShowAddress(!showAddress)} className="text-primary hover:underline cursor-pointer">
                            {t(`action.change`)}
                        </button>
                        {showAddress && (
                            <div className="absolute top-12 py-1 bg-white border border-gray-300 text-sm w-full">
                                <p onClick={() => setShowAddress(false)} className="text-gray-500 p-2 hover:bg-gray-100">
                                    New York, USA
                                </p>
                                <p onClick={() => setShowAddress(false)} className="text-primary text-center cursor-pointer p-2 hover:bg-primary/10">
                                    {t(`action.addAddress`)}
                                </p>
                            </div>
                        )}
                    </div>

                    <p className="text-sm font-medium uppercase mt-6">{t(`cart.payMethod`)}</p>

                    <select className="w-full border border-gray-300 bg-white px-3 py-2 mt-2 outline-none">
                        <option value="COD">{t(`action.cash`)}</option>
                        <option value="Online">{t(`action.onl`)}</option>
                    </select>
                </div>

                <hr className="border-gray-300" />

                <div className="text-gray-500 mt-4 space-y-2">
                    <p className="flex justify-between">
                        <span>{t(`cart.price`)}</span><span>{Number(getCartAmount())?.toLocaleString()}VND</span>
                    </p>
                    <p className="flex justify-between">
                        <span>{t(`cart.fee`)}</span><span className="text-green-600">{t(`cart.free`)}</span>
                    </p>
                    <p className="flex justify-between">
                        <span>{t(`cart.tax`)} (2%)</span><span>{Number(getCartAmount() * 0.02)?.toLocaleString()}VND</span>
                    </p>
                    <p className="flex justify-between text-lg font-medium mt-3">
                        <span>{t(`cart.total`)}:</span><span>{Number(getCartAmount() + (getCartAmount() * 0.02))?.toLocaleString()}VND</span>
                    </p>
                </div>

                <button className="w-full py-3 mt-6 cursor-pointer bg-primary text-white font-medium hover:bg-primary-dull transition rounded-md">
                    {t(`action.placeOrder`)}
                </button>
            </div>
        </div>
    )
}
export default Cart
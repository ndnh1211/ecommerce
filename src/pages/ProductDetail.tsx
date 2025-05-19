import { useParams } from "react-router-dom"
import { assets, dummyProducts } from "../assets/assets";
import { useState } from "react";
import { useTranslation } from "react-i18next";

export const ProductDetail = () => {
    const { t } = useTranslation()
    const params = useParams();
    const productDetail = dummyProducts.find(product => product._id === params.id)
    const [thumbnail, setThumbnail] = useState(productDetail?.image[0]);

    return productDetail && (
        <div className="max-w-6xl w-full px-6 pb-24">
            <p>
                <span>{t(`header.home`)}</span> /
                <span> {t(`header.product`)}</span> /
                <span> {t(`categories.${productDetail.category}`)}</span> /
                <span className="text-primary"> {productDetail.name}</span>
            </p>

            <div className="flex flex-col md:flex-row gap-16 mt-4">
                <div className="flex gap-3">
                    <div className="flex flex-col gap-3">
                        {productDetail.image.map((image, index) => (
                            <div key={index} onClick={() => setThumbnail(image)} className="border max-w-24 border-gray-500/30 rounded overflow-hidden cursor-pointer" >
                                <img src={image} alt={`Thumbnail ${index + 1}`} />
                            </div>
                        ))}
                    </div>

                    <div className="border border-gray-500/30 max-w-100 rounded overflow-hidden">
                        <img src={thumbnail} alt="Selected product" />
                    </div>
                </div>

                <div className="text-sm w-full md:w-1/2">
                    <h1 className="text-3xl font-medium">{productDetail.name}</h1>

                    <div className="flex items-center gap-0.5 mt-1">
                        {
                            Array(5).fill('').map((_, i) => (
                                productDetail.rating > i ? (
                                    <img src={assets.star_icon} alt="Star" className="size-4" />
                                ) : (
                                    <img src={assets.star_dull_icon} alt="Star" className="size-4" />)
                            ))
                        }
                        <p className="text-base ml-2">({productDetail.rating})</p>
                    </div>

                    <div className="mt-6">
                        <p className="text-gray-500/70 line-through">{productDetail.price?.toLocaleString()}VND</p>
                        <p className="text-2xl font-medium">{productDetail.offerPrice?.toLocaleString()}VND</p>
                        <span className="text-gray-500/70">({t(`productDetail.tax`)})</span>
                    </div>

                    <p className="text-base font-medium mt-6">{t(`productDetail.about`)}</p>
                    <ul className="list-disc ml-4 text-gray-500/70">
                        {productDetail.description.map((desc, index) => (
                            <li key={index}>{desc}</li>
                        ))}
                    </ul>

                    <div className="flex items-center mt-10 gap-4 text-base">
                        <button className="w-full py-3.5 cursor-pointer font-medium bg-gray-100 text-gray-800/80 hover:bg-gray-200 rounded-md transition" >
                            {t(`action.addToCart`)}
                        </button>
                        <button className="w-full py-3.5 cursor-pointer font-medium bg-primary text-white hover:bg-primary-dull rounded-md transition" >
                            {t(`action.buyNow`)}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

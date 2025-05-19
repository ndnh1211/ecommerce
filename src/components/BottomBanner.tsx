import { useTranslation } from "react-i18next"
import { assets, features } from "../assets/assets"

const BottomBanner = () => {
    const { t } = useTranslation()
    return (
        <div className="relative mt-24">
            <img src={assets.bottom_banner_image} alt="BottomBanner"
                loading="lazy" className="w-full hidden md:block" />
            <img src={assets.bottom_banner_image_sm} alt="BottomBanner"
                loading="lazy" className="w-full block md:hidden" />
            <div className=" absolute inset-0 flex flex-col items-center md:items-end md:justify-center pt-16 md:pr-24">
                <div className="">
                    <h1 className="text-2xl md:text-3xl font-semibold text-primary mb-6">
                        {t(`home.why.title`)}
                    </h1>
                    {
                        features.map((features, index) => (
                            <div className="flex items-center gap-4 mt-2" key={`features-${index}`}>
                                <img
                                    src={features.icon}
                                    alt={features.title}
                                    loading="lazy"
                                    className="md:w-11 w-9" />
                                <div className="flex flex-col">
                                    <h3 className="text-lg md:text-xl font-semibold text-gray-600">
                                        {t(`home.why.${features.title}`)}
                                    </h3>
                                    <p className="text-gray-400 text-xs md:text-sm">
                                        {t(`home.why.${features.description}`)}
                                    </p>
                                </div>
                            </div>
                        ))
                    }
                </div>
            </div>
        </div>
    )
}
export default BottomBanner
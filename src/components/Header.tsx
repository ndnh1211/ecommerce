import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";
import { useTranslation } from "react-i18next";
import { useAppContext } from "../context/AppContext";
import Logo from "./Logo";
import Login from "./Login";

const Header = () => {
    const navigate = useNavigate()
    const { i18n, t } = useTranslation()
    const [code, setCode] = useState<"vi" | "en">("vi")
    const [open, setOpen] = useState(false)
    const { getCartCount, theme, setTheme, userLogin, setUserLogin } = useAppContext();
    useEffect(() => {
        i18n.changeLanguage(code)
    }, [code]);

    return (
        <>
            <nav className="flex items-center justify-between px-6 md:px-16 lg:px-24 xl:px-32 py-4 border-b border-gray-300 bg-base-100 sticky top-0 z-10 transition-all">

                <Link to="/">
                    <Logo />
                </Link>

                {/* Desktop Menu */}
                <div className="hidden sm:flex items-center gap-8">
                    <Link to="/">{t(`header.home`)}</Link>
                    <Link to="/product">{t(`header.product`)}</Link>
                    <Link to="/contact">{t(`header.contact`)}</Link>

                    <div className="hidden lg:flex items-center text-sm gap-2 border border-gray-300 px-3 rounded-full">
                        <input className="py-1.5 w-full bg-transparent outline-none placeholder-gray-500" type="text" placeholder={t(`header.search`)} />
                        <img src={assets.search_icon} alt="Search" className="size-4" />
                    </div>

                    <div onClick={() => navigate('/cart')} className="relative cursor-pointer">
                        <img src={assets.cart_icon} alt="Cart" className="size-5" />
                        <button className="absolute -top-2 -right-3 text-xs text-white bg-primary w-[18px] h-[18px] rounded-full">{getCartCount()}</button>
                    </div>

                    <button onClick={() => { setUserLogin(true) }} className="cursor-pointer px-8 py-2 bg-primary hover:bg-primary-dull transition text-white rounded-full">
                        {t(`header.login`)}
                    </button>
                    <select
                        className="border-none text-primary outline-none"
                        value={code}
                        onChange={(e) => setCode(e.target.value as "vi" | "en")}>
                        <option value="vi"> VI </option>
                        <option value="en">EN</option>
                    </select>
                    <label className="swap swap-rotate size-5">
                        <input type="checkbox" checked={theme === "light"} onChange={() => setTheme(theme === "light" ? "dark" : "light")} />
                        <svg
                            className="swap-on size-6 fill-current"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24">
                            <path
                                d="M5.64,17l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l.71-.71A1,1,0,0,0,5.64,17ZM5,12a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12Zm7-7a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4A1,1,0,0,0,12,5ZM5.64,7.05a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.41l-.71-.71A1,1,0,0,0,4.93,6.34Zm12,.29a1,1,0,0,0,.7-.29l.71-.71a1,1,0,1,0-1.41-1.41L17,5.64a1,1,0,0,0,0,1.41A1,1,0,0,0,17.66,7.34ZM21,11H20a1,1,0,0,0,0,2h1a1,1,0,0,0,0-2Zm-9,8a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V20A1,1,0,0,0,12,19ZM18.36,17A1,1,0,0,0,17,18.36l.71.71a1,1,0,0,0,1.41,0,1,1,0,0,0,0-1.41ZM12,6.5A5.5,5.5,0,1,0,17.5,12,5.51,5.51,0,0,0,12,6.5Zm0,9A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z" />
                        </svg>
                        <svg
                            className="swap-off size-6 fill-current"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24">
                            <path
                                d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22v.27A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.73Z" />
                        </svg>
                    </label>
                </div>

                <button onClick={() => open ? setOpen(false) : setOpen(true)} aria-label="Menu" className="sm:hidden">
                    {/* Menu Icon SVG */}
                    <svg width="21" height="15" viewBox="0 0 21 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect width="21" height="1.5" rx=".75" fill="#426287" />
                        <rect x="8" y="6" width="13" height="1.5" rx=".75" fill="#426287" />
                        <rect x="6" y="13" width="15" height="1.5" rx=".75" fill="#426287" />
                    </svg>
                </button>

                {/* Mobile Menu */}
                <div className={`${open ? 'flex' : 'hidden'} absolute top-[60px] left-0 w-full bg-white shadow-md py-4 flex-col items-start gap-2 px-5 text-sm md:hidden`}>
                    <Link to="/" className="block">{t(`header.hone`)}</Link>
                    <Link to="/product" className="block">{t(`header.product`)}</Link>
                    <Link to="/contact" className="block">{t(`header.contact`)}</Link>
                    <button onClick={() => { setUserLogin(true) }} className="cursor-pointer px-6 py-2 mt-2 bg-primary hover:bg-primary-dull transition text-white rounded-full text-sm">
                        {t(`header.login`)}
                    </button>
                    <select value={code} onChange={(e) => setCode(e.target.value as "vi" | "en")}>
                        <option value="vi">Tiếng Việt</option>
                        <option value="en">English</option>
                    </select>
                </div>
            </nav>
            {
                userLogin && <Login />
            }
        </>
    )
}
export default Header;
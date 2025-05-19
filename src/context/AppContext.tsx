import React, { createContext, useContext, useEffect, useState } from "react";
import { dummyProducts } from "../assets/assets";

export const AppContext = createContext<AppContextType | undefined>(undefined);
export const AppContextProvider = ({ children }: { children: React.ReactNode }) => {
    const [cartItems, setCartItems] = useState<Record<string, number>>({});
    const [theme, setTheme] = useState(localStorage.getItem("theme") || "light")
    const [userLogin, setUserLogin] = useState(false)
    // Thêm sản phẩm vào giỏ hàng
    const addToCart = (id: string) => {
        const cartData = structuredClone(cartItems);
        if (cartData[id]) {
            cartData[id] += 1;
        } else {
            cartData[id] = 1;
        }
        setCartItems(cartData);
    }
    // Trừ số lượng sản phẩm trong giỏ hàng
    const minusFromCart = (id: string) => {
        const CartData = structuredClone(cartItems);
        if (CartData[id] > 0) {
            CartData[id] -= 1
        } else {
            delete CartData[id];
        }
        setCartItems(CartData);
    }
    //xoa san pham ra khoi gio hang
    const removeFromCart = (id: string) => {
        const cartData = structuredClone(cartItems);
        delete cartData[id];
        setCartItems(cartData);
    }

    // lay so luong san pham trong gio hang
    const getCartCount = () => {
        return Object.keys(cartItems).length;
    }

    // tong so tien trong gio hang
    const getCartAmount = () => {
        let amount = 0;
        for (const item in cartItems) {
            const product = dummyProducts.find(pro => pro._id === item);
            if (product)
                amount += product?.offerPrice * cartItems[item];
        }
        return Math.floor(amount)
    }
    useEffect(() => {
        if (theme) {
            localStorage.setItem("theme", theme)
        }
    }, [theme])
    const value = {
        cartItems,
        setCartItems,
        addToCart,
        minusFromCart,
        removeFromCart,
        getCartCount,
        getCartAmount,
        theme,
        setTheme,
        userLogin,
        setUserLogin
    }
    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    )
}

export const useAppContext = () => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error("Chưa tạo context!");
    }
    return context
}
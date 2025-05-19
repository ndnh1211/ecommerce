type ProductType = {
    _id: string;
    name: string;
    category: string;
    price: number;
    offerPrice: number;
    weight: string;
    image: string[];
    description: string[];
    createdAt: string;
    updatedAt: string;
    inStock: boolean;
    rating: number;
}
interface AppContextType {
    cartItems: Record<string, number>;
    setCartItems: (e: Record<string, number>) => void;
    addToCart: (id: string) => void;
    minusFromCart: (id: string) => void;
    removeFromCart: (id: string) => void;
    getCartCount: () => number;
    getCartAmount: () => number;
    theme: string;
    setTheme: (e: string) => void;
    userLogin: boolean;
    setUserLogin: (e: boolean) => void;
}
interface categoryType {
    text: string;
    path: string;
    image: string;
    bgColor: string;
}
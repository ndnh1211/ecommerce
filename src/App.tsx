import { Route, Routes } from "react-router-dom"
import Home from "./pages/Home"
import Layout from "./pages/layout"
import { JSX } from "react"
import Product from "./pages/Product"
import Contact from "./pages/Contact"
import { ProductDetail } from "./pages/ProductDetail"
import Cart from "./pages/Cart"
import i18next, { use } from "i18next"
import { initReactI18next } from "react-i18next"
import vi from "./locales/vi.json"
import en from "./locales/en.json"
import ProductCategory from "./pages/ProductCategory"
import { useAppContext } from "./context/AppContext"
type PageProps = {
  path: string,
  element: JSX.Element
}


const App = () => {
  const pages: PageProps[] = [
    {
      path: "/",
      element: <Layout><Home /></Layout>
    },
    {
      path: "/product",
      element: <Layout><Product /></Layout>
    },
    {
      path: "/contact",
      element: <Layout><Contact /></Layout>
    },
    {
      path: "/product/:category/:id",
      element: <Layout><ProductDetail /></Layout>
    },
    {
      path: "/cart",
      element: <Layout><Cart /></Layout>
    },
    {
      path: "/product/:category",
      element: <Layout><ProductCategory /></Layout>
    },
  ]
  use(initReactI18next).init({
    lng: localStorage.getItem("language") || 'vi',
    resources: {
      vi: {
        translation: vi
      },
      en: {
        translation: en
      }
    }
  })
  i18next.on("languageChanged", (lang_code) => {
    localStorage.setItem("language", lang_code);
  })
  const { theme } = useAppContext()
  return (
    <div data-theme={theme}>
      <Routes>
        {
          pages.map((page) => (
            <Route key={page.path} path={page.path} element={page.element} />
          ))
        }
      </Routes>
    </div>
  )
}

export default App
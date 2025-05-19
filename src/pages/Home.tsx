import MainBaner from "../components/MainBaner"
import Category from "../components/Category"
import BestSeller from "../components/BestSeller"
import BottomBanner from "../components/BottomBanner"
import NewLetter from "../components/NewLetter"
const Home = () => {
    return (
        <div className="mt-10">
            <MainBaner />
            <Category />
            <BestSeller />
            <BottomBanner />
            <NewLetter />
        </div>
    )
}

export default Home
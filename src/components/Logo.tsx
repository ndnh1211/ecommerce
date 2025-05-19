import { assets } from "../assets/assets"
import { cn } from "../lib/utils"

interface Props {
    className?: string
}
const Logo = ({ className }: Props) => {
    return (
        <div className={cn("flex items-center gap-2", className)}>
            <img src={assets.logo} alt="logo" className="h-8 md:h-9 mt-1" />
            <p className="text-primary md:text-2xl text-lg" >Ecommerce</p>
        </div>
    )
}
export default Logo
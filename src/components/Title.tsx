import { ReactNode } from "react"
import { cn } from "../lib/utils";

interface Props {
    children: ReactNode;
    title: string;
    className?: string;
}
const Title = ({ children, title, className }: Props) => {
    return (
        <div className={cn(
            "flex flex-col mt-16",
            className
        )}>
            <div className="flex flex-col items-end w-max">
                <p className={cn("text-2xl md:text-3xl font-medium uppercase")}>{title}</p>
            </div>
            {children}
        </div>
    )
}
export default Title
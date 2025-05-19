import { cn } from "../lib/utils"
import { Facebook, Github, Instagram, Mail, MapPin, Phone, Send, Twitter } from "lucide-react"
import { useTranslation } from "react-i18next"
import { Tooltip, VariantType } from "react-tooltip";
import { useAppContext } from "../context/AppContext";

const Contact = () => {
    const { t } = useTranslation();
    const { theme } = useAppContext()
    const handleSubmit = () => { }
    return (
        <div className="mt-16 pb-24">
            <div className="flex flex-col items-center justify-center w-max mx-auto mb-8">
                <p className={cn("text-2xl md:text-3xl font-medium uppercase")}>
                    {t(`contact.title`)}
                </p>
                <div className="w-16 h-0.5 bg-primary rounded-full" />
            </div>
            <div className="max-w-5xl mx-auto bg-primary/10 border border-primary/50 p-6 rounded-md">
                <div className="grid md:grid-cols-5 gap-10">
                    <div className="md:col-span-2 space-y-8">
                        <div className="space-y-6">
                            <h3 className="text-xl font-semibold font-display"> {t(`contact.info`)}</h3>
                            <p className="text-muted-foreground">
                                {t(`contact.desc`)}
                            </p>
                        </div>

                        <div className="space-y-6">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full flex items-center justify-center bg-primary/10 text-primary">
                                    <Mail className="h-5 w-5" />
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Email</p>
                                    <a href="mailto:0995086534ts@gmail.com" className="font-medium text-gray-700">0995086534ts@gmail.com</a>
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full flex items-center justify-center bg-primary/10 text-primary">
                                    <Phone className="h-5 w-5" />
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground"> {t(`contact.phone`)}</p>
                                    <a href="tel:+11234567890" className="font-medium text-gray-700">+84 587 928 264</a>
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full flex items-center justify-center bg-primary/10 text-primary">
                                    <MapPin className="h-5 w-5" />
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground"> {t(`contact.address`)}</p>
                                    <a href="https://www.google.com/maps/place/Qu%E1%BA%ADn+4,+H%E1%BB%93+Ch%C3%AD+Minh" target="_blank" className="font-medium text-gray-700">District 4, HCMC</a>
                                </div>
                            </div>
                        </div>
                        <div className="py-4">
                            <div className="w-full h-[1px] bg-primary/50" />
                        </div>

                        <div className="flex gap-4">
                            <a
                                href="#"
                                data-tooltip-id={"Twitter"}
                                className="w-10 h-10 rounded-full flex items-center justify-center bg-foreground/5 hover:bg-foreground/10 transition-colors group"
                                aria-label="Twitter"
                            >
                                <Twitter className="fill-black group-hover:fill-primary group-hover:text-primary" />
                            </a>
                            <Tooltip
                                id={"Twitter"}
                                place="bottom"
                                variant={theme as VariantType || "light"}
                                content={"Twitter"}
                            />

                            <a
                                href="#"
                                data-tooltip-id={"Facebook"}
                                className="w-10 h-10 rounded-full flex items-center justify-center bg-foreground/5 hover:bg-foreground/10 transition-colors group"
                                aria-label="Facebook"
                            >
                                <Facebook className="fill-black group-hover:fill-primary group-hover:text-primary" />
                            </a>
                            <Tooltip
                                id={"Facebook"}
                                place="bottom"
                                variant={theme as VariantType || "light"}
                                content={"Facebook"}
                            />
                            <a
                                href="#"
                                data-tooltip-id={"Instagram"}
                                className="w-10 h-10 rounded-full flex items-center justify-center bg-foreground/5 hover:bg-foreground/10 transition-colors group"
                                aria-label="Instagram"
                            >
                                <Instagram className="group-hover:text-primary" />
                            </a>
                            <Tooltip
                                id={"Instagram"}
                                place="bottom"
                                variant={theme as VariantType || "light"}
                                content={"Instagram"}
                            />
                            <a
                                href="#"
                                data-tooltip-id={"Github"}
                                className="w-10 h-10 rounded-full flex items-center justify-center bg-foreground/5 hover:bg-foreground/10 transition-colors group"
                                aria-label="Github"
                            >
                                <Github className="group-hover:text-primary" />
                            </a>
                            <Tooltip
                                id={"Github"}
                                place="bottom"
                                variant={theme as VariantType || "light"}
                                content={"Github"}
                            />
                        </div>
                    </div>

                    <div className="md:col-span-3">
                        <form
                            onSubmit={handleSubmit}
                            className="bg-card rounded-xl shadow-subtle border border-primary/50 p-4"
                        >
                            <div className="grid gap-6">
                                <div className="grid sm:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label htmlFor="name">{t(`contact.form.name`)}</label>
                                        <input
                                            id="name"
                                            name="name"
                                            placeholder="John Doe"
                                            className="rounded-lg border py-2 px-2.5 w-full focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                                            value={""}
                                            onChange={() => { }}
                                            required
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label htmlFor="email">{t(`contact.form.email`)}</label>
                                        <input
                                            id="email"
                                            name="email"
                                            type="email"
                                            placeholder="john@example.com"
                                            className="rounded-lg border py-2 px-2.5 w-full focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                                            value={""}
                                            onChange={() => { }}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="subject">{t(`contact.form.subject`)}</label>
                                    <input
                                        id="subject"
                                        name="subject"
                                        placeholder="How can I help you?"
                                        className="rounded-lg border py-2 px-2.5 w-full focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                                        value={""}
                                        onChange={() => { }}
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="message">{t(`contact.form.message`)}</label>
                                    <textarea
                                        id="message"
                                        name="message"
                                        placeholder="Your message here..."
                                        className="rounded-lg border py-2 px-2.5 w-full h-[150px] resize-none focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                                        value={""}
                                        onChange={() => { }}
                                        required
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="w-full rounded-lg transition-all bg-primary hover:bg-primary-dull py-3 px-3.5 flex items-center justify-center"
                                >
                                    <span className="flex items-center gap-2 text-white">
                                        <Send className="h-4 w-4" />
                                        {t(`contact.form.button`)}
                                    </span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Contact
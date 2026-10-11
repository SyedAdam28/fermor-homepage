import type { Metadata } from "next";
import "./globals.css";
import "./atmosphere.css";
import "./questions.css";
import "./refinements.css";
import "./reference-design.css";
export const metadata: Metadata = { title: "Fermor — Your money. A clearer next move.", description: "An interactive Fermor homepage concept. Explore example answers about your spending, investments and goals.", icons: { icon: "/favicon.svg" } };
export default function RootLayout({ children }: {children:React.ReactNode}) { return <html lang="en"><head><link rel="preload" as="font" href="/fonts/manrope.ttf" type="font/ttf" crossOrigin="anonymous"/></head><body>{children}</body></html>; }

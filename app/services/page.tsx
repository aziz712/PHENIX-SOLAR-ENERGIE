import { Metadata } from "next";
import ServicesClient from "./ServicesClient";

export const metadata: Metadata = {
    title: "Nos Solutions Solaires - Installation & Pompage | PHOENIX SOLAR ENERGY",
    description: "Solutions photovoltaïques clés en main : résidentiel, industriel et pompage solaire. Réduisez votre facture STEG dès aujourd'hui. Expertise certifiée.",
};

export default function ServicesPage() {
    return <ServicesClient />;
}

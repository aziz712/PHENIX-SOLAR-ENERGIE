import { Metadata } from "next";
import ContactClient from "./ContactClient";

export const metadata: Metadata = {
    title: "Contactez-nous - Devis Panneaux Solaires Gratuit | PHÉNIX SOLAR ÉNERGIE",
    description: "Demandez votre étude gratuite pour une installation photovoltaïque. Contactez nos experts à Sousse et Tunis pour un avenir durable.",
};

export default function ContactPage() {
    return <ContactClient />;
}

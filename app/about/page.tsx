import { Metadata } from "next";
import AboutClient from "./AboutClient";

export const metadata: Metadata = {
    title: "À Propos de PHÉNIX SOLAR ÉNERGIE - Entreprise Énergie Solaire Tunisie",
    description: "Découvrez PHÉNIX SOLAR ÉNERGIE, votre partenaire de confiance pour l'énergie solaire en Tunisie. Équipe certifiée, garantie 25 ans et service premium.",
};

export default function AboutPage() {
    return <AboutClient />;
}

import { Metadata } from "next";
import ProjectsClient from "./ProjectsClient";

export const metadata: Metadata = {
    title: "Nos Réalisations - Installations Photovoltaïques Tunisie | PHOENIX SOLAR ENERGY",
    description: "Découvrez nos projets d'installation de panneaux solaires à travers la Tunisie. Résidentiel, industriel, pompage solaire et plus.",
};

export default function ProjectsPage() {
    return <ProjectsClient />;
}

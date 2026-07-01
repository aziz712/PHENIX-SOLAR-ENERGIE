"use client";

import { useState, useEffect } from 'react';
import { Loader2, Zap, MapPin, X, ChevronLeft, ChevronRight } from 'lucide-react';
import clsx from 'clsx';

const categories = ["Tous", "Résidentiel", "Industriel", "Pompage"];

export default function Realisations() {
    const [projects, setProjects] = useState<any[]>([]);
    const [filter, setFilter] = useState("Tous");
    const [loading, setLoading] = useState(true);
    const [selectedProject, setSelectedProject] = useState<any | null>(null);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        try {
            const res = await fetch("/api/gallery");
            const data = await res.json();
            if (data.projects) setProjects(data.projects);
        } catch (error) {
            console.error("Error fetching projects:", error);
        } finally {
            setLoading(false);
        }
    };

    const filteredProjects = filter === "Tous"
        ? projects
        : projects.filter(p => p.category === filter);

    const openProject = (project: any) => {
        console.log("Opening project:", project);
        setSelectedProject(project);
        setCurrentImageIndex(0);
        document.body.style.overflow = 'hidden';
    };

    const closeProject = () => {
        setSelectedProject(null);
        document.body.style.overflow = 'unset';
    };

    const nextImage = () => {
        if (!selectedProject) return;
        const allImages = [selectedProject.image, ...(selectedProject.additionalImages || [])];
        setCurrentImageIndex((prev) => (prev + 1) % allImages.length);
    };

    const prevImage = () => {
        if (!selectedProject) return;
        const allImages = [selectedProject.image, ...(selectedProject.additionalImages || [])];
        setCurrentImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
    };

    return (
        <main className="min-h-screen bg-gray-50 text-deep-blue font-sans">

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-extrabold mb-6 text-deep-blue">
                        Nos <span className="text-solar-orange">Réalisations</span>
                    </h1>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        Découvrez comment nous transformons l'énergie solaire en solutions concrètes pour nos clients.
                    </p>
                </div>

                {/* Filters */}
                <div className="flex flex-wrap justify-center gap-4 mb-12">
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setFilter(cat)}
                            className={clsx(
                                "px-6 py-2 rounded-full text-sm font-bold transition-all transform hover:-translate-y-0.5",
                                filter === cat
                                    ? "bg-deep-blue text-white shadow-lg shadow-blue-200"
                                    : "bg-white text-gray-600 hover:bg-gray-100 shadow-sm"
                            )}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Gallery Grid */}
                {loading ? (
                    <div className="flex justify-center py-20">
                        <Loader2 className="w-12 h-12 animate-spin text-solar-orange" />
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredProjects.map((project, idx) => (
                            <div
                                key={project._id}
                                className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col h-full"
                                onClick={() => openProject(project)}
                            >
                                <div className="aspect-4/3 relative overflow-hidden">
                                    <img
                                        src={project.image}
                                        alt={project.title}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                                        <span className="text-white font-bold tracking-wide">Voir le détail →</span>
                                    </div>
                                    <div className="absolute top-4 right-4">
                                        <span className="bg-white/95 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-deep-blue shadow-sm">
                                            {project.category}
                                        </span>
                                    </div>
                                </div>
                                <div className="p-6 flex-1 flex flex-col">
                                    <h3 className="text-2xl font-bold text-deep-blue mb-2">{project.title}</h3>
                                    <p className="text-gray-500 text-base line-clamp-2 mb-4 flex-1">{project.description}</p>

                                    <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-auto">
                                        <div className="flex flex-col gap-1.5">
                                            <div className="flex items-center gap-2 text-lg text-gray-600">
                                                <MapPin className="w-5 h-5 text-solar-orange" />
                                                <span className="font-medium">{project.location}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-lg text-gray-600">
                                                <Zap className="w-5 h-5 text-solar-yellow" />
                                                <span className="font-bold">{project.powerKW} kWc</span>
                                            </div>
                                        </div>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); openProject(project); }}
                                            className="px-5 py-2.5 bg-blue-50 text-deep-blue text-base font-bold rounded-xl hover:bg-deep-blue hover:text-white transition-all shadow-sm"
                                        >
                                            Voir Détails
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Project Details Modal */}
            {selectedProject && (
                <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm" onClick={closeProject}>
                    <div className="bg-white rounded-3xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col md:flex-row shadow-2xl" onClick={e => e.stopPropagation()}>

                        {/* Image Slider Section */}
                        <div className="w-full md:w-3/5 bg-black relative aspect-video md:aspect-auto">
                            {(() => {
                                const allImages = [selectedProject.image, ...(selectedProject.additionalImages || [])];
                                return (
                                    <>
                                        <img
                                            src={allImages[currentImageIndex]}
                                            alt={selectedProject.title}
                                            className="w-full h-full object-contain"
                                        />

                                        {allImages.length > 1 && (
                                            <>
                                                <button
                                                    onClick={prevImage}
                                                    className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
                                                >
                                                    <ChevronLeft className="w-6 h-6" />
                                                </button>
                                                <button
                                                    onClick={nextImage}
                                                    className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
                                                >
                                                    <ChevronRight className="w-6 h-6" />
                                                </button>
                                                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                                                    {allImages.map((_, idx) => (
                                                        <button
                                                            key={idx}
                                                            onClick={() => setCurrentImageIndex(idx)}
                                                            className={clsx(
                                                                "w-2 h-2 rounded-full transition-all",
                                                                idx === currentImageIndex ? "bg-white w-4" : "bg-white/50 hover:bg-white/80"
                                                            )}
                                                        />
                                                    ))}
                                                </div>
                                            </>
                                        )}
                                    </>
                                );
                            })()}
                        </div>

                        {/* Details Section */}
                        <div className="w-full md:w-2/5 p-8 overflow-y-auto bg-white flex flex-col relative">
                            <button
                                onClick={closeProject}
                                className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors z-10"
                            >
                                <X className="w-6 h-6 text-gray-500" />
                            </button>

                            <div className="mt-2">
                                <span className="inline-block px-3 py-1 bg-solar-orange/10 text-solar-orange rounded-full text-xs font-bold uppercase tracking-wider mb-4">
                                    {selectedProject.category}
                                </span>
                                <h2 className="text-3xl font-extrabold text-deep-blue mb-4 leading-tight">
                                    {selectedProject.title}
                                </h2>

                                <div className="flex flex-col gap-4 text-base text-gray-600 mb-8 pb-8 border-b border-gray-100">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                                            <MapPin className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <div className="text-sm text-gray-400 font-bold uppercase tracking-wider">Localisation</div>
                                            <div className="text-xl font-bold text-gray-900">{selectedProject.location}</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4 mt-2">
                                        <div className="w-12 h-12 rounded-full bg-yellow-50 flex items-center justify-center text-yellow-600">
                                            <Zap className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <div className="text-sm text-gray-400 font-bold uppercase tracking-wider">Puissance Installée</div>
                                            <div className="text-xl font-bold text-gray-900">{selectedProject.powerKW} kWc</div>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-lg font-bold text-deep-blue mb-3">À propos du projet</h3>
                                    <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                                        {selectedProject.description}
                                    </p>
                                </div>
                            </div>

                            <div className="mt-auto pt-8">
                                <button
                                    onClick={() => window.location.href = '/contact'}
                                    className="w-full py-4 bg-deep-blue text-white font-bold rounded-xl hover:bg-solar-orange transition-colors shadow-lg shadow-blue-900/10"
                                >
                                    Demander un devis similaire
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}

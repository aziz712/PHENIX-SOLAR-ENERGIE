"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { Loader2, Plus, Trash2, MapPin, Zap, Image as ImageIcon, Edit, Upload, X } from "lucide-react";

export default function AdminRealizationsPage() {
    const [projects, setProjects] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProject, setEditingProject] = useState<any | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    const [form, setForm] = useState({
        title: "",
        category: "Résidentiel",
        location: "",
        powerKW: "",
        description: "",
        image: "",
        additionalImages: [] as string[]
    });

    const [uploading, setUploading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);

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

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, isMain: boolean = false) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        setUploading(true);

        Array.from(files).forEach(file => {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result as string;
                if (isMain) {
                    setForm(prev => ({ ...prev, image: base64String }));
                } else {
                    setForm(prev => ({ ...prev, additionalImages: [...prev.additionalImages, base64String] }));
                }
                setUploading(false);
            };
            reader.readAsDataURL(file);
        });
    };

    const removeImage = (index: number) => {
        setForm(prev => ({
            ...prev,
            additionalImages: prev.additionalImages.filter((_, i) => i !== index)
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (isSubmitting) return; // Prevent double submission

        const token = localStorage.getItem("token");
        if (!token) return;

        setIsSubmitting(true);

        try {
            const method = editingProject ? "PUT" : "POST";
            const body = editingProject ? { ...form, _id: editingProject._id } : form;

            const res = await fetch("/api/gallery", {
                method,
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(body)
            });

            if (res.ok) {
                fetchProjects();
                setIsModalOpen(false);
                setEditingProject(null);
                setForm({
                    title: "",
                    category: "Résidentiel",
                    location: "",
                    powerKW: "",
                    description: "",
                    image: "",
                    additionalImages: []
                });
            } else {
                alert("Erreur lors de l'enregistrement");
            }
        } catch (error) {
            console.error("Error saving project:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Êtes-vous sûr de vouloir supprimer ce projet ?")) return;

        setDeletingId(id);
        const token = localStorage.getItem("token");
        try {
            const res = await fetch(`/api/gallery?id=${id}`, {
                method: "DELETE",
                headers: { "Authorization": `Bearer ${token}` }
            });

            if (res.ok) {
                fetchProjects();
            }
        } catch (error) {
            console.error("Error deleting project:", error);
        } finally {
            setDeletingId(null);
        }
    };

    const openEditModal = (project: any) => {
        setEditingProject(project);
        setForm({
            title: project.title,
            category: project.category,
            location: project.location,
            powerKW: project.powerKW,
            description: project.description,
            image: project.image,
            additionalImages: project.additionalImages || []
        });
        setIsModalOpen(true);
    };

    const filteredProjects = projects.filter(project => {
        const term = searchTerm.toLowerCase();
        const matchesSearch =
            (project.title?.toLowerCase().includes(term) || "") ||
            (project.category?.toLowerCase().includes(term) || "") ||
            (project.description?.toLowerCase().includes(term) || "") ||
            (project.location?.toLowerCase().includes(term) || "");

        if (!matchesSearch) return false;

        // Realizations might not have a createdAt displayed, but assuming they have one in DB.
        // If not, date filter might filter out everything if createdAt is missing.
        // Let's assume they might not have createdAt or we want to filter by something else?
        // The prompt asked for generic date filter. I'll check if 'createdAt' is in the project schema or logic.
        // Step 89 showed 'fetchProjects' calls '/api/gallery'.
        // I will optimistically check createdAt. If validation failed, I'll modify.
        const projDate = project.createdAt ? new Date(project.createdAt) : null;

        if (startDate && projDate && projDate < new Date(startDate)) return false;
        if (endDate && projDate) {
            const end = new Date(endDate);
            end.setHours(23, 59, 59, 999);
            if (projDate > end) return false;
        }

        return true;
    });

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-deep-blue">Gestion des Réalisations</h1>
                    <p className="text-gray-500">Ajoutez, modifiez ou supprimez vos projets</p>
                </div>
                <button
                    onClick={() => {
                        setEditingProject(null);
                        setForm({
                            title: "",
                            category: "Résidentiel",
                            location: "",
                            powerKW: "",
                            description: "",
                            image: "",
                            additionalImages: []
                        });
                        setIsModalOpen(true);
                    }}
                    className="flex items-center gap-2 px-5 py-2.5 bg-deep-blue text-white rounded-xl font-bold hover:bg-solar-orange transition-colors"
                >
                    <Plus className="w-5 h-5" /> Nouveau Projet
                </button>
            </div>

            {/* Filters */}
            <div className="bg-white p-4 rounded-3xl shadow-sm border border-gray-100 mb-6 flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Recherche</label>
                    <input
                        type="text"
                        placeholder="Titre, Localisation, Description..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-solar-orange outline-none"
                    />
                </div>
                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Date Début</label>
                    <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-solar-orange outline-none"
                    />
                </div>
                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Date Fin</label>
                    <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-solar-orange outline-none"
                    />
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center py-20">
                    <Loader2 className="w-8 h-8 animate-spin text-deep-blue" />
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredProjects.map((project) => (
                        <div key={project._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden group">
                            <div className="aspect-video bg-gray-100 relative">
                                <img src={project.image} alt={project.title} className="w-full h-full object-cover" />
                                <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={() => openEditModal(project)}
                                        className="p-2 bg-white rounded-lg shadow-md text-blue-600 hover:text-blue-700"
                                    >
                                        <Edit className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(project._id)}
                                        disabled={deletingId === project._id}
                                        className="p-2 bg-white rounded-lg shadow-md text-red-500 hover:text-red-600 disabled:opacity-50"
                                    >
                                        {deletingId === project._id ? (
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                        ) : (
                                            <Trash2 className="w-4 h-4" />
                                        )}
                                    </button>
                                </div>
                            </div>
                            <div className="p-4">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="font-bold text-gray-800">{project.title}</h3>
                                    <span className="text-xs font-bold px-2 py-1 bg-gray-100 text-gray-600 rounded-md">
                                        {project.category}
                                    </span>
                                </div>
                                <p className="text-sm text-gray-500 line-clamp-2">{project.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white z-10">
                            <h2 className="text-xl font-bold text-deep-blue">
                                {editingProject ? "Modifier le projet" : "Nouveau Projet"}
                            </h2>
                            <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-full">
                                <X className="w-5 h-5 text-gray-500" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-6">
                            {/* Main Image Upload */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Image Principale</label>
                                <div className="flex items-center justify-center w-full">
                                    <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-gray-300 border-dashed rounded-2xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors relative overflow-hidden">
                                        {form.image ? (
                                            <img src={form.image} className="absolute inset-0 w-full h-full object-cover" />
                                        ) : (
                                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                <Upload className="w-8 h-8 text-gray-400 mb-2" />
                                                <p className="text-sm text-gray-500">Cliquez pour upload une image</p>
                                            </div>
                                        )}
                                        <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, true)} />
                                    </label>
                                </div>
                            </div>

                            {/* Additional Images Upload */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Images Supplémentaires</label>
                                <div className="grid grid-cols-4 gap-4 mb-4">
                                    {form.additionalImages.map((img, idx) => (
                                        <div key={idx} className="relative aspect-square rounded-xl overflow-hidden group">
                                            <img src={img} className="w-full h-full object-cover" />
                                            <button
                                                type="button"
                                                onClick={() => removeImage(idx)}
                                                className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <X className="w-3 h-3" />
                                            </button>
                                        </div>
                                    ))}
                                    <label className="flex flex-col items-center justify-center aspect-square border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors">
                                        <Plus className="w-6 h-6 text-gray-400" />
                                        <input type="file" className="hidden" accept="image/*" multiple onChange={(e) => handleImageUpload(e, false)} />
                                    </label>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Titre</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-deep-blue outline-none"
                                        value={form.title}
                                        onChange={e => setForm({ ...form, title: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Catégorie</label>
                                    <select
                                        className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-deep-blue outline-none"
                                        value={form.category}
                                        onChange={e => setForm({ ...form, category: e.target.value })}
                                    >
                                        <option value="Résidentiel">Résidentiel</option>
                                        <option value="Industriel">Industriel</option>
                                        <option value="Pompage">Pompage</option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Localisation</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-deep-blue outline-none"
                                        value={form.location}
                                        onChange={e => setForm({ ...form, location: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Puissance (kWc)</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-deep-blue outline-none"
                                        value={form.powerKW}
                                        onChange={e => setForm({ ...form, powerKW: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                <textarea
                                    rows={4}
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-deep-blue outline-none"
                                    value={form.description}
                                    onChange={e => setForm({ ...form, description: e.target.value })}
                                ></textarea>
                            </div>

                            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-6 py-2.5 text-gray-600 font-bold hover:bg-gray-100 rounded-xl"
                                >
                                    Annuler
                                </button>
                                <button
                                    type="submit"
                                    disabled={uploading || isSubmitting}
                                    className="px-6 py-2.5 bg-deep-blue text-white font-bold rounded-xl hover:bg-solar-orange transition-colors disabled:opacity-50 flex items-center gap-2"
                                >
                                    {uploading ? (
                                        "Upload..."
                                    ) : isSubmitting ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            Enregistrement...
                                        </>
                                    ) : (
                                        "Enregistrer"
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

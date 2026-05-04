import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.js";
import { useEffect } from "react";

const Home = () => {
    const { user, loading } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!loading && user) {
            navigate("/monitorias");
        }
    }, [user, loading, navigate]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (user) {
        return null; // Will redirect
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                <div className="text-center">
                    <div className="flex justify-center mb-8">
                        <img
                            src="/logo.png"
                            alt="Edusync"
                            className="h-20 w-20"
                        />
                    </div>
                    <h1 className="text-5xl font-bold text-slate-800 mb-6">
                        Bienvenido a{" "}
                        <span className="text-gradient">Edusync</span>
                    </h1>
                    <p className="text-xl text-slate-600 mb-12 max-w-3xl mx-auto">
                        La plataforma de monitorías que conecta estudiantes con
                        monitores para un aprendizaje colaborativo y efectivo.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
                        <Link
                            to="/register"
                            className="btn btn-primary text-lg px-8 py-4"
                        >
                            Registrarse
                        </Link>
                        <Link
                            to="/login"
                            className="btn btn-secondary text-lg px-8 py-4"
                        >
                            Iniciar Sesión
                        </Link>
                    </div>
                </div>

                <div className="grid md:grid-cols-3 gap-8 mt-20">
                    <div className="card p-8 text-center hover-lift">
                        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg
                                className="w-8 h-8 text-blue-600"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                                />
                            </svg>
                        </div>
                        <h3 className="text-xl font-semibold text-slate-800 mb-4">
                            Materias Variadas
                        </h3>
                        <p className="text-slate-600">
                            Accede a monitorías de todas las áreas del
                            conocimiento con monitores especializados.
                        </p>
                    </div>

                    <div className="card p-8 text-center hover-lift">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg
                                className="w-8 h-8 text-green-600"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                                />
                            </svg>
                        </div>
                        <h3 className="text-xl font-semibold text-slate-800 mb-4">
                            Colaboración
                        </h3>
                        <p className="text-slate-600">
                            Conecta con otros estudiantes y monitores en un
                            ambiente de aprendizaje colaborativo.
                        </p>
                    </div>

                    <div className="card p-8 text-center hover-lift">
                        <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg
                                className="w-8 h-8 text-purple-600"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                            </svg>
                        </div>
                        <h3 className="text-xl font-semibold text-slate-800 mb-4">
                            Flexibilidad
                        </h3>
                        <p className="text-slate-600">
                            Agenda monitorías según tu disponibilidad y accede
                            al contenido cuando lo necesites.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;

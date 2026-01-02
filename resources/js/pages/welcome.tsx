import { Head, Link } from '@inertiajs/react';

export default function Welcome() {
    return (
        <>
            <Head title="Bienvenue" />

            <div className="relative min-h-screen overflow-hidden bg-black text-white">
                {/* Video Background */}
                <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="absolute inset-0 h-full w-full object-cover"
                >
                    <source src="/video.mp4" type="video/mp4" />
                </video>

                {/* Overlay */}
                <div className="absolute inset-0 bg-black/70" />

                {/* Content */}
                <div className="relative z-10 flex min-h-screen flex-col">
                    {/* Header */}
                    <header className="flex items-center justify-between px-6 py-5 lg:px-16">
                        <div className="flex items-center gap-3">
                            <img
                                src="/images/logo.png"
                                alt="Logo"
                                className="h-10 w-auto"
                            />
                        </div>

                        <div className="flex gap-3">
                            <Link
                                href="/login"
                                className="rounded-md border border-white/30 px-4 py-2 text-sm transition hover:bg-white hover:text-black"
                            >
                                Connexion
                            </Link>
                            <Link
                                href="/register"
                                className="rounded-md bg-orange-500 px-4 py-2 text-sm font-semibold text-black transition hover:bg-orange-400"
                            >
                                Inscription
                            </Link>
                        </div>
                    </header>

                    {/* Hero */}
                    <main className="flex flex-1 items-center px-6 lg:px-16">
                        <div className="max-w-2xl">
                            <h1 className="text-4xl font-bold leading-tight lg:text-6xl">
                                Gérez vos Visiteurs <br />
                                <span className="text-orange-400">
                                    simplement & efficacement
                                </span>
                            </h1>

                            <p className="mt-6 text-lg text-gray-300">
                                Une plateforme moderne pour centraliser
                                vos opérations, et guider par l'Intelligence Artificielle,
                                accessible partout.
                            </p>

                            <div className="mt-8 flex flex-wrap gap-4">
                                <Link
                                    href="/register"
                                    className="rounded-md bg-orange-500 px-6 py-3 font-semibold text-black transition hover:bg-orange-400"
                                >
                                    Commencer maintenant
                                </Link>

                                <Link
                                    href="/login"
                                    className="rounded-md border border-white/30 px-6 py-3 transition hover:bg-white hover:text-black"
                                >
                                    Accéder à mon espace
                                </Link>
                            </div>
                        </div>
                    </main>

                    {/* Footer */}
                    <footer className="px-6 py-4 text-center text-sm text-gray-400 lg:px-16">
                        © {new Date().getFullYear()} — Tous droits réservés
                    </footer>
                </div>
            </div>
        </>
    );
}

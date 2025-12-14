import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { Container } from "../components/ui/Container";
import { Button } from "../components/ui/Button";
import { CheckCircle2, ArrowRight } from "lucide-react";
import confetti from "canvas-confetti";

export function ThankYou() {
    useEffect(() => {
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#15803d', '#dcfce7', '#d97706']
        });
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Header />
            <main className="flex-grow flex items-center justify-center py-20 px-4">
                <Container size="sm" className="text-center">
                    <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl border border-gray-100">
                        <div className="h-24 w-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <CheckCircle2 className="h-12 w-12 text-farm-green" strokeWidth={3} />
                        </div>
                        
                        <h1 className="text-3xl md:text-5xl font-extrabold text-farm-dark mb-4">
                            Mulțumim!
                        </h1>
                        <p className="text-xl text-gray-600 mb-8 max-w-lg mx-auto">
                            Comanda ta a fost confirmată. Abonamentul tău este acum activ și prima cutie este în pregătire!
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link to="/subscriptii">
                                <Button size="lg" className="w-full sm:w-auto shadow-lg shadow-farm-green/20">
                                    Vezi Abonamentul <ArrowRight className="ml-2 h-5 w-5" />
                                </Button>
                            </Link>
                            <Link to="/">
                                <Button variant="ghost" size="lg" className="w-full sm:w-auto">
                                    Înapoi la site
                                </Button>
                            </Link>
                        </div>
                    </div>
                </Container>
            </main>
            <Footer />
        </div>
    );
}

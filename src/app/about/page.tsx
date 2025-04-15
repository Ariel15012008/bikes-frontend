import { Header } from "@/components/header";
import Image from 'next/image';

export default function About() {
    return(
        <div>
            <Header />
            <main>
                <section id="home" className="relative max-md:mb-28 md:mb-32">
                    <div className="relative w-full h-[300px] sm:h-[400px] md:h-[500px]">
                        <Image
                            src="/img/fundo-about.png"
                            alt="Fundo"
                            fill
                            className="object-cover"
                            priority
                            style={{
                                objectPosition: 'center 30%' // Ajuste este valor (30%) para mover para baixo
                            }}
                        />
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-4 bg-black/30">
                            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-[40px] font-bold font-gill-sans sm:mb-6 md:mb-8 pt-20">
                                Quem somos
                            </h1>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}
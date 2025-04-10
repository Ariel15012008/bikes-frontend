'use client';

import { useEffect, useState } from 'react';
import { FaMagnifyingGlass, FaArrowRightToBracket } from 'react-icons/fa6';
import { Header } from "../../components/header";
import { Footer } from "../../components/footer";
import Image from 'next/image';
import Link from 'next/link';
import { authFetch } from "../utils/authFetch";

const Home = () => {
  useEffect(() => {
    async function renewToken() {
        const res = await authFetch("http://localhost:8000/auth/refresh-token", {
          method: "POST",
        });
        if (res.ok) {
          const data = await res.json();
        }
    }

    renewToken();
  }, []);

  const [activeTab, setActiveTab] = useState("tab1");
  const [searchValue, setSearchValue] = useState("");

  const cardSection2Data = [
    { image: "/img/card1.png", link: "/page1" },
    { image: "/img/card2.png", link: "/page2" },
    { image: "/img/card3.png", link: "/page3" },
    { image: "/img/card4.png", link: "/page4" },
    { image: "/img/card5.png", link: "/page5" },
    { image: "/img/card6.png", link: "/page6" },
  ];

  const cardSection4Data = [
    { image: "/img/style.png", link: "/oferta1", title: "MOUNTAIN BIKE" },
    { image: "/img/style.png", link: "/oferta3", title: "TRIATHLON" },
    { image: "/img/style.png", link: "/oferta4", title: "TRIAL" },
    { image: "/img/style.png", link: "/oferta2", title: "BIKES ANTIGAS" },
    { image: "/img/style.png", link: "/oferta5", title: "BIKE ELÉTRICA" },
    { image: "/img/style.png", link: "/oferta6", title: "SPEED" },
  ];

  return (
    <div className="font-sans m-0 p-0">
      <Header />

      <main className="mt-[60px]">
        {/* Section 1 - Hero com barra de pesquisa */}
        <section id="home" className="relative max-md:mb-28 md:mb-32">
          <div className="relative w-full h-[300px] sm:h-[400px] md:h-[500px]">
            <Image
              src="/img/fundo-home.png"
              alt="Fundo"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-4">
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-[40px] font-bold font-gill-sans mb-4 sm:mb-6 md:mb-8">
                Seu principal marketplace de bikes
              </h1>
            </div>
            
            {/* Barra de pesquisa ajustada */}
            <div className="absolute -bottom-12 sm:-bottom-16 left-1/2 transform -translate-x-1/2 bg-white rounded-xl shadow-lg w-[90%] sm:w-[700px] md:w-[750px] h-[100px] sm:h-[120px] ">
              <div className="flex w-full h-[35px] sm:h-[40px] rounded-tl-lg overflow-hidden">
                <button
                  className={`flex-1 font-bold text-sm sm:text-base transition-colors ${
                    activeTab === "tab1"
                      ? "bg-[#09bc8a] text-white"
                      : "bg-[#f5f5f5] text-[#868686] hover:opacity-90"
                  }`}
                  onClick={() => setActiveTab("tab1")}>
                  Bikes
                </button>
                <button
                  className={`flex-1 font-bold text-sm sm:text-base transition-colors ${
                    activeTab === "tab2"
                      ? "bg-[#09bc8a] text-white"
                      : "bg-[#f5f5f5] text-[#868686] hover:opacity-90"
                  }`}
                  onClick={() => setActiveTab("tab2")}>
                  Peças e acessórios
                </button>
                <button
                  className="w-[100px] sm:w-[150px] bg-gradient-to-r from-[#09bc8a] to-[#0c1b33] text-white font-bold flex items-center justify-center gap-1 sm:gap-2 hover:from-[#08ab7d] hover:to-[#0a172e] rounded-tr-lg text-sm sm:text-base">
                  <FaMagnifyingGlass className="text-lg sm:text-xl" />
                  <span>Pesquisar</span>
                </button>
              </div>
              <input
                type="search"
                placeholder="Digite aqui o que você procura..."
                className="w-full h-[35px] sm:h-[40px] mt-2 sm:mt-3 px-3 sm:px-4 rounded border-none focus:outline-none focus:ring-2 focus:ring-[#09bc8a] text-sm sm:text-base"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
              />
            </div>
          </div>
        </section>
{/* Section 2 - Escolha por marca (versão final) */}
<section className="mb-10  md:mb-16 px-4 sm:px-5 text-center">
  <h1 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 mt-4 sm:mb-5">
    Escolha por marca
  </h1>
  <div className="flex justify-center xl:pr-48">
    <div className="grid grid-cols-3 p-2 sm:gap-5 max-sm:gap-2 w-full max-w-[700px] relative">
      {/* 6 cards de marcas (2 linhas de 3 colunas) - Mantido original */}
      {cardSection2Data.map((card, index) => (
        <Link
          href={card.link}
          key={index}
          className="w-full h-[120px] sm:h-[160px] mx-auto">
          <div className="bg-white rounded-md shadow-md relative gap-3 w-full h-full overflow-hidden">
            <Image
              src={card.image}
              alt={`Marca ${index + 1}`}
              fill
              className="object-contain p-3 sm:p-4"
            />
          </div>
        </Link>
      ))}
      
      {/* Anúncio DESKTOP (acima de 1260px) - Mantido original */}
      <div className="hidden min-[1230px]:block absolute -right-4 top-0 
                      w-[120px] sm:w-[150px] md:w-[180px] lg:w-[220px] 
                      h-[250px] sm:h-[280px] md:h-[330px] lg:h-[360px] 
                      bg-gray-100 rounded-md shadow-md items-center justify-center 
                      transform translate-x-full">
        <h5 className="text-base sm:text-lg font-bold">Anúncio</h5>
      </div>
      
      {/* Anúncio MOBILE (abaixo de 1260px) - Nova versão */}
      <div className="min-[1230px]:hidden w-auto h-[120px] mt-6 mr-2 bg-gray-100 rounded-md shadow-md flex items-center justify-center col-span-3">
        <h5 className="text-base font-bold">Anúncio</h5>
      </div>
    </div>
  </div>
</section>

        {/* Section 3 - Destaque da semana */}
        <section className="mb-10 md:mb-16 text-center px-4">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-5">
            Destaque da semana
          </h1>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-5">
            {[1, 2].map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-md shadow-md w-full max-w-[450px] h-[350px] sm:h-[400px] p-3 sm:p-4 flex flex-col">
                <div className="relative w-full h-[150px] sm:h-[200px]">
                  <Image
                    src="/img/highlight.png"
                    alt="Produto destaque"
                    fill
                    className="object-contain p-3 sm:p-4"
                  />
                </div>
                <div className="flex justify-between items-center mt-3 sm:mt-4">
                  <h5 className="text-lg sm:text-xl font-bold">Garmin Edge 530</h5>
                  <span className="text-xl sm:text-2xl font-bold text-[#09bc8a]">
                    R$ 1.299
                  </span>
                </div>
                <a
                  href="#"
                  className="mt-3 sm:mt-4 bg-gradient-to-r from-[#09bc8a] to-[#0c1b33] text-white py-2 px-4 rounded font-bold text-center hover:opacity-90 text-sm sm:text-base">
                  Adicionar ao carrinho
                </a>
              </div>
            ))}
          </div>
          <div className="bg-gray-100 h-[150px] sm:h-[220px] w-full max-w-[920px] mx-auto mt-8 sm:mt-10 mb-8 sm:mb-10 rounded-md shadow-md flex items-center justify-center">
            <h5 className="text-base sm:text-lg font-bold">Anúncio</h5>
          </div>
        </section>

        {/* Section 4 - Estilos */}
        <section className="bg-[#09bc8a] py-10 sm:py-16 px-4">
          <div className="text-center">
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-6 sm:mb-10">
              QUAL O SEU <span className="font-black">ESTILO?</span>
            </h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 justify-center max-w-5xl mx-auto">
              {cardSection4Data.map((card, index) => (
                <Link
                  href={card.link}
                  key={index}
                  className="w-full sm:w-[200px] md:w-[220px] h-[250px] sm:h-[280px] mx-auto">
                  <div className="bg-white rounded-lg shadow-md p-3 sm:p-4 flex flex-col h-full">
                    <div className="relative flex-1">
                      <Image
                        src={card.image}
                        alt={card.title}
                        fill
                        className="object-contain p-3 sm:p-4"
                      />
                    </div>
                    <h5 className="font-bold text-[#09bc8a] mt-2 text-center truncate text-sm sm:text-base">
                      {card.title}
                    </h5>
                    <button className="mt-2 sm:mt-3 bg-gradient-to-r from-[#09bc8a] to-[#0c1b33] text-white py-2 rounded font-bold flex items-center justify-center gap-1 sm:gap-2 hover:opacity-90 text-sm sm:text-base">
                      Confira <FaArrowRightToBracket />
                    </button>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Section 5 - Selecionados para você */}
        <section className="my-10 sm:my-16 text-center px-4">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-5">
            Olha o que selecionamos pra você
          </h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 justify-center max-w-4xl mx-auto">
            {[1, 2, 3, 4].map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-md shadow-md w-full max-w-[350px] h-[330px] sm:h-[380px] p-3 sm:p-4 flex flex-col mx-auto">
                <div className="relative w-full h-[140px] sm:h-[180px]">
                  <Image
                    src="/img/highlight.png"
                    alt={`Produto ${i + 1}`}
                    fill
                    className="object-contain p-3 sm:p-4"
                  />
                </div>
                <div className="flex justify-between items-center mt-3 sm:mt-4">
                  <h5 className="text-lg sm:text-xl font-bold">Produto {i + 1}</h5>
                  <span className="text-xl sm:text-2xl font-bold text-[#09bc8a]">
                    R$ 999
                  </span>
                </div>
                <a
                  href="#"
                  className="mt-3 sm:mt-4 bg-gradient-to-r from-[#09bc8a] to-[#0c1b33] text-white py-2 px-4 rounded font-bold text-center hover:opacity-90 text-sm sm:text-base">
                  Adicionar ao carrinho
                </a>
              </div>
            ))}
          </div>
          <div className="bg-gray-100 h-[150px] sm:h-[220px] w-full max-w-[920px] mx-auto mt-8 sm:mt-10 mb-8 sm:mb-10 rounded-md shadow-md flex items-center justify-center">
            <h5 className="text-base sm:text-lg font-bold">Anúncio</h5>
          </div>
        </section>

        {/* Section 6 - Mais procurados */}
        <section className="bg-[#ebf1f0] py-10 sm:py-16 px-4">
          <div className="text-center">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-5">
              Mais Procurados
            </h1>
            <div className="flex justify-center">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 w-full max-w-[1400px]">
                {[1, 2, 3, 4].map((_, i) => (
                  <div
                    key={i}
                    className="bg-white rounded-md shadow-md w-full max-w-[350px] h-[330px] sm:h-[380px] p-3 sm:p-4 flex flex-col mx-auto">
                    <div className="relative w-full h-[140px] sm:h-[180px]">
                      <Image
                        src="/img/highlight.png"
                        alt={`Produto ${i + 1}`}
                        fill
                        className="object-contain p-3 sm:p-4"
                      />
                    </div>
                    <div className="flex justify-between items-center mt-3 sm:mt-4">
                      <h5 className="text-lg sm:text-xl font-bold">Produto {i + 1}</h5>
                      <span className="text-xl sm:text-2xl font-bold text-[#09bc8a]">
                        R$ 999
                      </span>
                    </div>
                    <a
                      href="#"
                      className="mt-3 sm:mt-4 bg-gradient-to-r from-[#09bc8a] to-[#0c1b33] text-white py-2 px-4 rounded font-bold text-center hover:opacity-90 text-sm sm:text-base">
                      Adicionar ao carrinho
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Section 7 - Instagram */}
        <section className="py-10 sm:py-16 text-center px-4">
          <h2 className="text-lg sm:text-xl font-bold text-[#0C1B33] mb-6 sm:mb-8">
            Confira nosso Instagram
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 max-w-4xl mx-auto mb-6 sm:mb-8">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="bg-[#09BC8A] aspect-square rounded-lg"></div>
            ))}
          </div>
          <a href="https://www.instagram.com/bikescombr/">
            <button className="bg-gradient-to-r from-[#09BC8A] to-[#0C1B33] text-white py-2 px-4 sm:px-6 rounded font-bold flex items-center justify-center gap-2 mx-auto hover:opacity-90 text-sm sm:text-base">
              📷 Siga-nos agora
            </button>
          </a>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Home;
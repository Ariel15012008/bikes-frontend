'use client';

import { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { FaMagnifyingGlass, FaArrowRightToBracket } from 'react-icons/fa6';
import { Header } from "@/components/header";
import {Footer} from "@/components/footer";
import Image from 'next/image';
import Link from 'next/link';

const cardSection2Data = [
  { image: '/img/card1.png', link: '/page1' },
  { image: '/img/card2.png', link: '/page2' },
  { image: '/img/card3.png', link: '/page3' },
  { image: '/img/card4.png', link: '/page4' },
  { image: '/img/card5.png', link: '/page5' },
  { image: '/img/card6.png', link: '/page6' },
];

const cardSection4Data = [
  { image: '/img/style.png', link: '/oferta1', title: 'MOUNTAIN BIKE' },
  { image: '/img/style.png', link: '/oferta3', title: 'TRIATHLON' },
  { image: '/img/style.png', link: '/oferta4', title: 'TRIAL' },
  { image: '/img/style.png', link: '/oferta2', title: 'BIKES ANTIGAS' },
  { image: '/img/style.png', link: '/oferta5', title: 'BIKE ELÉTRICA' },
  { image: '/img/style.png', link: '/oferta6', title: 'SPEED' },
];

export default function Home() {
  const [searchValue, setSearchValue] = useState('');

  return (
    <div className="font-sans">
      <Header />

      <main className="mt-16 px-5">
        {/* Section 1 */}
        <section className="relative mb-20">
          <Image
            src="/img/fundo-home.png"
            alt="Fundo"
            fill
            className="w-full h-auto object-cover"
          />
          <div className="absolute top-32 w-full text-center text-white text-4xl font-bold">
            Seu principal marketplace de bikes
          </div>
          <div className="absolute top-[85%] left-1/2 transform -translate-x-1/2 bg-white shadow-md rounded-2xl p-5 w-[750px] z-10">
            <Tabs defaultValue="bikes" className="w-full">
              <TabsList className="flex justify-between mb-4 bg-gray-100 rounded-lg overflow-hidden">
                <TabsTrigger value="bikes" className="w-full">Bikes</TabsTrigger>
                <TabsTrigger value="pecas" className="w-full">Peças e acessórios</TabsTrigger>
              </TabsList>
              <TabsContent value="bikes">
                <Input
                  placeholder="Digite aqui o que você procura..."
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                />
              </TabsContent>
              <TabsContent value="pecas">
                <Input
                  placeholder="Buscar peças e acessórios..."
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                />
              </TabsContent>
            </Tabs>
            <Button className="mt-4 w-full flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-slate-900 text-white">
              <FaMagnifyingGlass /> Pesquisar
            </Button>
          </div>
        </section>

        {/* Section 2 - Escolha por marca */}
        <section className="text-center my-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Escolha por marca</h2>
          <div className="grid grid-cols-3 gap-5 justify-center max-w-4xl mx-auto">
            {cardSection2Data.map((card, index) => (
              <Link href={card.link} key={index}>
                <Card className="overflow-hidden h-40 relative">
                  <Image src={card.image} alt={`Card ${index + 1}`} fill className="object-cover" />
                </Card>
              </Link>
            ))}
            <Card className="col-span-1 row-span-2 bg-gray-100 flex justify-center items-center h-[360px]">
              <span className="text-lg font-bold">Anúncio</span>
            </Card>
          </div>
        </section>

        {/* Section 3 - Destaques da semana */}
        <section className="text-center my-12">
          <h2 className="text-2xl font-bold mb-6">Destaque da semana</h2>
          <div className="flex justify-center gap-5 flex-wrap">
            {[1, 2].map((_, i) => (
              <Card key={i} className="w-[450px] h-[400px] flex flex-col justify-between p-4">
                <Image src="/img/highlight.png" alt="Destaque" width={400} height={200} className="w-full h-52 object-cover" />
                <div className="flex justify-between mt-4">
                  <h3 className="text-xl font-semibold">Garmin Edge 530</h3>
                  <span className="text-emerald-500 text-2xl font-bold">R$ 1.299</span>
                </div>
                <Button className="mt-2 bg-gradient-to-r from-emerald-500 to-slate-900 text-white">
                  Adicionar ao carrinho
                </Button>
              </Card>
            ))}
          </div>
        </section>

        {/* Section 4 - Estilos */}
        <section className="bg-emerald-500 py-16 text-white text-center">
          <h2 className="text-3xl font-bold mb-10">QUAL O SEU <span className="font-black">ESTILO?</span></h2>
          <div className="grid grid-cols-3 gap-6 justify-center max-w-5xl mx-auto">
            {cardSection4Data.map((card, index) => (
              <Link href={card.link} key={index}>
                <Card className="bg-white text-emerald-600 flex flex-col items-center justify-between p-4 h-72">
                  <Image src={card.image} alt={card.title} width={180} height={150} className="object-contain h-36" />
                  <h5 className="text-lg font-bold mt-2">{card.title}</h5>
                  <Button className="bg-gradient-to-r from-emerald-500 to-slate-900 text-white mt-2">
                    Confira <FaArrowRightToBracket className="ml-2" />
                  </Button>
                </Card>
              </Link>
            ))}
          </div>
        </section>

        {/* Section 5 e 6 - Reutilização de destaque */}
        {['Olha o que selecionamos pra você', 'Mais Procurados'].map((title, i) => (
          <section className={`${i === 1 ? 'bg-emerald-50' : ''} py-12 text-center`} key={i}>
            <h2 className="text-2xl font-bold mb-6">{title}</h2>
            <div className="grid grid-cols-2 gap-6 justify-center max-w-4xl mx-auto">
              {[1, 2, 3, 4].map((_, index) => (
                <Card key={index} className="w-[350px] h-[380px] flex flex-col justify-between p-4">
                  <Image src="/img/highlight.png" alt="Produto" width={350} height={180} className="object-cover h-44" />
                  <div className="flex justify-between mt-4">
                    <h3 className="text-lg font-semibold">Produto {index + 1}</h3>
                    <span className="text-emerald-500 text-2xl font-bold">R$ 999</span>
                  </div>
                  <Button className="mt-2 bg-gradient-to-r from-emerald-500 to-slate-900 text-white">
                    Adicionar ao carrinho
                  </Button>
                </Card>
              ))}
            </div>
          </section>
        ))}

        {/* Section 7 - Instagram */}
        <section className="text-center py-12">
          <h2 className="text-lg font-bold text-slate-900 mb-6">Confira nosso Instagram</h2>
          <div className="grid grid-cols-3 gap-4 max-w-5xl mx-auto mb-6">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="bg-emerald-500 w-full h-48 rounded-md"></div>
            ))}
          </div>
          <a href="https://www.instagram.com/bikescombr/">
            <Button className="bg-gradient-to-r from-emerald-500 to-slate-900 text-white">
              📷 Siga-nos agora
            </Button>
          </a>
        </section>
      </main>

      <Footer />
    </div>
  );
}

'use client';

import { Header } from "@/components/header";
import {Footer} from "@/components/footer";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 flex items-center justify-center p-6">
        <h2 className="text-2xl font-semibold">Bem-vindo à Home Page!</h2>
      </main>
      <Footer />
    </div>
  );
}

'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FaArrowRightToBracket } from 'react-icons/fa6';

const Footer = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  return (
    <footer className="bg-gray-100 py-8 w-full shadow-md">
      <div className="container mx-auto flex flex-col items-center text-center md:text-left md:items-start md:flex-row md:justify-between px-6 md:px-16">
        
        {/* Logo (vai para o topo no mobile) */}
        <div className="order-1 md:order-2 flex flex-col items-center md:items-start">
          <img src="/img/logo.png" alt="Logo" className="w-28 md:w-36 mb-4" />
        </div>

        {/* Links (ficam abaixo da logo no mobile) */}
        <div className="order-2 md:order-1 flex flex-wrap justify-center gap-8 mt-4 md:mt-0">
          <ul className="space-y-2 text-gray-700 text-sm md:text-base">
            <li><a href="#about" className="hover:text-green-500">Política de troca</a></li>
            <li><a href="#services" className="hover:text-green-500">Perguntas frequentes</a></li>
            <li><a href="#contact" className="hover:text-green-500">Política de privacidade</a></li>
          </ul>
          <ul className="space-y-2 text-gray-700 text-sm md:text-base">
            <li><a href="#faq" className="hover:text-green-500">Crie sua conta</a></li>
            <li><a href="#faq" className="hover:text-green-500">Trabalhe conosco</a></li>
            <li><a href="#faq" className="hover:text-green-500">Anuncie na Bikes.com.br</a></li>
          </ul>
        </div>

        {/* Ícones sociais (abaixo dos links no mobile) */}
        <div className="order-3 flex justify-center space-x-4 mt-6 md:mt-0">
          <a href="https://wa.me/" target="_blank" rel="noopener noreferrer">
            <img src="/img/whatsapp-footer.png" alt="WhatsApp" className="h-6 w-6 md:h-8 md:w-8 hover:scale-110 transition" />
          </a>
          <a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer">
            <img src="/img/instagram-footer.png" alt="Instagram" className="h-6 w-6 md:h-8 md:w-8 hover:scale-110 transition" />
          </a>
          <a href="https://www.facebook.com/" target="_blank" rel="noopener noreferrer">
            <img src="/img/facebook-footer.png" alt="Facebook" className="h-6 w-6 md:h-8 md:w-8 hover:scale-110 transition" />
          </a>
        </div>

        {/* Newsletter (vai para o final no mobile) */}
        <div className="order-4 w-full max-w-sm mt-6 md:mt-0">
          <label htmlFor="email" className="block text-lg font-semibold text-gray-900">Assine nossa Newsletter</label>
          <div className="flex flex-col md:flex-row items-center space-y-3 md:space-y-0 md:space-x-2 mt-2">
            <Input
              type="email"
              id="email"
              placeholder="Digite seu e-mail"
              className="border border-green-500 rounded-md px-3 py-2 w-full text-sm md:text-base"
              required
            />
            <Button
              disabled={isLoading}
              className="bg-gradient-to-r from-green-500 to-blue-900 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm md:text-base"
            >
              {isLoading ? <span className="animate-spin">🔄</span> : <>Enviar <FaArrowRightToBracket /></>}
            </Button>
          </div>
        </div>

      </div>

      {/* Direitos autorais */}
      <div className="text-center text-gray-600 text-xs md:text-sm mt-6 border-t pt-4">
        &copy; {new Date().getFullYear()} Bikes.com.br. Todos os direitos reservados.
      </div>
    </footer>
  );
};

export default Footer;

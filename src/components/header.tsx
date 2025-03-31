"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { HiCog, HiShoppingBag, HiUsers, HiPhone, HiHome } from "react-icons/hi";
import { BiLogOut } from "react-icons/bi";
import { IoPersonCircle } from "react-icons/io5";
import { RxHamburgerMenu } from "react-icons/rx";

export function Header() {
  const [user, setUser] = useState<{ name: string; email: string } | null>(
    null
  );
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetch("http://localhost:8000/users/me", {
      method: "GET",
      credentials: "include", // ESSENCIAL para cookies HttpOnly
    })
      .then(async (res) => {
        if (!res.ok) throw new Error("Não autenticado");
        const data = await res.json();
        setUser({ name: data.nome, email: data.email });
        setIsAuthenticated(true);
      })
      .catch(() => {
        setUser(null);
        setIsAuthenticated(false);
      });
  }, []);

  const logout = async () => {
    await fetch("http://localhost:8000/auth/logout", {
      method: "POST",
      credentials: "include"
    });

    setIsAuthenticated(false);
    setUser(null);
    router.push("/login");
  };

  return (
    <header className="fixed top-0 left-0 w-full bg-white shadow-md flex items-center justify-between p-4 z-50">
      {/* Logo */}
      <Link href="/pages/home">
        <Image
          src="/img/logo.png"
          alt="Logo do Projeto"
          width={150}
          height={50}
        />
      </Link>

      {/* Links centrais (desktop) */}
      <nav className="hidden md:flex space-x-6 text-lg font-medium">
        <Link href="/pages/about" className="hover:text-gray-600">
          Quem somos
        </Link>
        <Link href="/pages/home" className="hover:text-gray-600">
          Comprar
        </Link>
        <Link href="/pages/sell" className="hover:text-gray-600">
          Vender
        </Link>
        <Link href="#contact" className="hover:text-gray-600">
          Contato
        </Link>
      </nav>

      {/* Ícones do canto direito */}
      <div className="hidden md:flex items-center space-x-4">
        <Link href="/cart">
          <Image src="/img/carrinho.png" alt="Carrinho" width={27} height={27} />
        </Link>
        <Link href="/favorites">
          <Image src="/img/favoritos.png" alt="Favoritos" width={27} height={27} />
        </Link>

        {isAuthenticated ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Image
                src="/img/user.png"
                alt="Usuário"
                width={30}
                height={30}
                className="rounded-full cursor-pointer"
              />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <IoPersonCircle className="mr-2" />
                <span>{user?.name || "Usuário"}</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <HiHome className="mr-2" />
                <Link href="/pages/home">Home</Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <HiCog className="mr-2" />
                <Link href="/pages/user">Configurações</Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={logout} className="text-red-600">
                <BiLogOut className="mr-2" />
                Sair
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Link
            href="/pages/login"
            className="text-lg font-medium hover:text-gray-600"
          >
            Entrar
          </Link>
        )}
      </div>

      {/* Menu Mobile */}
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" className="md:hidden scale-150">
            <RxHamburgerMenu />
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="w-64">
          <div className="p-4">
            <h2 className="text-xl font-semibold mb-4">Menu</h2>
            <nav className="space-y-4">
              <Link
                href="/about"
                className="flex items-center space-x-2 text-lg"
              >
                <HiHome />
                <span>Quem somos</span>
              </Link>
              <Link
                href="/home"
                className="flex items-center space-x-2 text-lg"
              >
                <HiShoppingBag />
                <span>Comprar</span>
              </Link>
              <Link
                href="/sell"
                className="flex items-center space-x-2 text-lg"
              >
                <HiUsers />
                <span>Vender</span>
              </Link>
              <Link
                href="#contact"
                className="flex items-center space-x-2 text-lg"
              >
                <HiPhone />
                <span>Contato</span>
              </Link>
            </nav>

            {isAuthenticated && (
              <>
                <div className="border-t my-4"></div>
                <Link
                  href="/user"
                  className="flex items-center space-x-2 text-lg"
                >
                  <IoPersonCircle />
                  <span>Perfil</span>
                </Link>
                <button
                  onClick={logout}
                  className="flex items-center space-x-2 text-lg text-red-600 w-full"
                >
                  <BiLogOut />
                  <span>Sair</span>
                </button>
              </>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </header>
  );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FaArrowRightToBracket } from "react-icons/fa6";
import { IoEyeSharp, IoEyeOffSharp } from "react-icons/io5";
import { toast } from "sonner"; // Importação do Sonner para exibir toasts
import api from "@/app/utils/axiosInstance";

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"form">) {
  const [formData, setFormData] = useState({
    email: "",
    senha: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await api.post("/auth/login", {
        email: formData.email,
        senha: formData.senha,
      });

      if (response.status === 200) {
        router.push("/");
      }
    } catch (error: any) {
      toast.error("Erro ao fazer login", {
        description:
          error.response?.data?.message || "Ocorreu um erro ao tentar fazer login.",
      });
      console.error("Erro:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      className={cn("flex flex-col gap-6", className)}
      onSubmit={handleLogin}
      {...props}
    >
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold text-gray-800">Faça seu login!</h1>
        <p className="text-base text-muted-foreground">
          Entre com seu e-mail e senha para acessar sua conta.
        </p>
      </div>

      <div className="grid gap-6">
        {/* Campo de Email */}
        <div className="grid gap-3">
          <Label htmlFor="email" className="text-gray-700 text-base">
            E-mail
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="m@example.com"
            value={formData.email}
            onChange={handleChange}
            className="bg-[#f9f9f9] border border-gray-300 focus:ring-0 transition-all text-base h-11"
            required
          />
        </div>

        {/* Campo de Senha */}
        <div className="grid gap-3">
          <div className="flex items-center">
            <Label htmlFor="password" className="text-gray-700 text-base">
              Senha
            </Label>
            <a
              href="#"
              className="ml-auto text-base font-medium text-[#2b866c] hover:text-[#0c1b33] underline-offset-4 hover:underline"
            >
              Esqueceu sua senha?
            </a>
          </div>
          <div className="relative">
            <Input
              id="password"
              name="senha"
              type={showPassword ? "text" : "password"}
              placeholder="Digite sua senha"
              value={formData.senha}
              onChange={handleChange}
              className="bg-[#f9f9f9] border border-gray-300 focus:border-[#09bc8a] focus:ring-0 transition-all text-base h-11 pr-12"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {showPassword ? <IoEyeOffSharp size={20} /> : <IoEyeSharp size={20} />}
            </button>
          </div>
        </div>

        {/* Botão de Login */}
        <Button
          type="submit"
          className="w-full bg-gradient-to-r from-[#09bc8a] to-[#0c1b33] text-white hover:opacity-90 text-base h-11"
          disabled={isLoading}
        >
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <>
              Entrar <FaArrowRightToBracket className="ml-2" size={18} />
            </>
          )}
        </Button>
      </div>

      {/* Link para Cadastro */}
      <div className="text-center text-base">
        Não tem uma conta?{" "}
        <a
          href="/register"
          className="text-[#2b866c] hover:text-[#0c1b33] font-medium underline underline-offset-4"
        >
          Cadastre-se
        </a>
      </div>
    </form>
  );
}

// Componente Toaster
import { useTheme } from "next-themes";
import { Toaster as Sonner } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

export function Toaster({ ...props }: ToasterProps) {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast: "group toast group-[.toaster]:bg-red-500 group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-muted-foreground",
          actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
        },
      }}
      {...props}
    />
  );
}

// Página de Login
export default function LoginPage() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      {/* Coluna Esquerda (Formulário) */}
      <div className="flex flex-col gap-6 p-8 md:p-10">
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-sm">
            <LoginForm />
          </div>
        </div>
      </div>

      {/* Coluna Direita (Imagem) */}
      <div className="relative hidden bg-muted lg:block">
        <img
          src="/img/fundo-cadastro.jpg"
          alt="Imagem de fundo"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-[#09bc8a]/50"></div>
      </div>

      {/* Toaster ajustado para ser menor em telas pequenas */}
      <div className="fixed top-4 right-0 z-50 max-w-[calc(100%-32px)] flex justify-end ">
        <Toaster position="bottom-right" />
      </div>
    </div>
  );
}

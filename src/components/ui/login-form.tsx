"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FaArrowRightToBracket } from "react-icons/fa6";
import { IoEyeSharp, IoEyeOffSharp } from "react-icons/io5";
import { toast } from "sonner"; // Importe o toast do Sonner
import api from "@/app/utils/axiosInstance";

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"form">) {
  const [formData, setFormData] = useState({
    email: "gabriel@mail.com",
    password: "12345",
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await api.post("/auth/login", {
        email: formData.email,
        senha: formData.password,
      });
    
      if (response.status === 200) {
        router.push("/pages/home"); // Redireciona para a página inicial
      }
    } catch (error: any) {
      // Exibe o toast em caso de erro
      toast.error("Erro ao fazer login", {
        description: error.response?.data?.message || "Ocorreu um erro ao tentar fazer login.",
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
      {...props}>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold text-gray-800">Faça seu login!</h1>
        <p className="text-balance text-base text-muted-foreground">
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
              className="ml-auto text-base font-medium text-[#2b866c] hover:text-[#0c1b33] underline-offset-4 hover:underline">
              Esqueceu sua senha?
            </a>
          </div>
          <div className="relative">
            <Input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Digite sua senha"
              value={formData.password}
              onChange={handleChange}
              className="bg-[#f9f9f9] border border-gray-300 focus:border-[#09bc8a] focus:ring-0 transition-all text-base h-11 pr-12"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className={`absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-transform duration-300 ${
                showPassword ? "rotate-180" : ""
              }`}>
              {showPassword ? (
                <IoEyeOffSharp size={20} />
              ) : (
                <IoEyeSharp size={20} />
              )}
            </button>
          </div>
        </div>

        {/* Botão de Login */}
        <Button
          type="submit"
          className="w-full bg-gradient-to-r from-[#09bc8a] to-[#0c1b33] text-white hover:opacity-90 text-base h-11"
          disabled={isLoading}>
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
          href="#"
          className="text-[#2b866c] hover:text-[#0c1b33] font-medium underline underline-offset-4">
          Cadastre-se
        </a>
      </div>
    </form>
  );
}
"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import api from "@/app/utils/axiosInstance";
import { IoEyeSharp, IoEyeOffSharp } from "react-icons/io5";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

export default function ResetPasswordPage() {
  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showNewPassword, setShowNewPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const token = searchParams.get("token");

  useEffect(() => {
    if (!token) {
      toast.error("Token inválido ou expirado.");
    }
  }, [token]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (formData.newPassword !== formData.confirmPassword) {
      toast.error("As senhas não coincidem.");
      setIsLoading(false);
      return;
    }

    try {
      const response = await api.post("/auth/reset-password", {
        token,
        nova_senha: formData.newPassword,
      });

      if (response.status === 200) {
        toast.success("Senha alterada com sucesso!");
        router.push("/login");
      }
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Erro ao alterar a senha."
      );
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 -z-10 lg:hidden">
        <img
          src="/img/fundo-cadastro.jpg"
          alt="Imagem de fundo"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-[#09bc8a]/50"></div>
      </div>

      <div className="grid min-h-svh lg:grid-cols-2">
        {/* Coluna da Imagem (agora no lado esquerdo) */}
        <div className="relative hidden lg:block overflow-hidden order-first">
          <AnimatePresence mode="wait">
            <motion.div
              key={pathname}
              initial={{ x: "-100%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "100%", opacity: 0 }}
              transition={{ duration: 0.7, ease: "easeInOut" }}
              className="absolute inset-0"
            >
              <img
                src="/img/fundo-cadastro.jpg"
                alt="Imagem de fundo"
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-[#09bc8a]/50"></div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Coluna do Formulário (agora no lado direito) */}
        <div className="flex flex-col gap-6 p-8 md:p-10 bg-white lg:bg-transparent rounded-xl lg:rounded-none shadow-xl lg:shadow-none mx-auto my-4 lg:my-0 w-full max-w-md lg:max-w-lg order-last">
          <AnimatePresence mode="wait">
            <motion.div
              key={pathname}
              initial={{ x: "100%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "-100%", opacity: 0 }}
              transition={{ duration: 0.7, ease: "easeInOut" }}
              className="flex flex-1 items-center justify-center"
            >
              <div className="w-full max-w-sm">
                <div className="flex flex-col items-center gap-2 text-center mb-6">
                  <h1 className="text-2xl font-bold text-gray-800">Redefinir Senha</h1>
                  <p className="text-base text-gray-600">
                    Digite sua nova senha para continuar
                  </p>
                </div>

                {!token ? (
                  <p className="text-red-600 text-center">Token inválido. Solicite novamente.</p>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="newPassword" className="text-gray-700 text-base">
                          Nova Senha
                        </Label>
                        <div className="relative">
                          <Input
                            id="newPassword"
                            name="newPassword"
                            type={showNewPassword ? "text" : "password"}
                            value={formData.newPassword}
                            onChange={handleChange}
                            className="bg-[#f9f9f9] border border-gray-300 focus:border-[#09bc8a] focus:ring-0 transition-all text-base h-11 pr-12"
                            placeholder="Digite sua nova senha"
                            required
                          />
                          <button
                            type="button"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                          >
                            {showNewPassword ? <IoEyeOffSharp size={20} /> : <IoEyeSharp size={20} />}
                          </button>
                        </div>
                      </div>

                      <div className="grid gap-2">
                        <Label htmlFor="confirmPassword" className="text-gray-700 text-base">
                          Confirmar Senha
                        </Label>
                        <div className="relative">
                          <Input
                            id="confirmPassword"
                            name="confirmPassword"
                            type={showConfirmPassword ? "text" : "password"}
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            className="bg-[#f9f9f9] border border-gray-300 focus:border-[#09bc8a] focus:ring-0 transition-all text-base h-11 pr-12"
                            placeholder="Confirme sua nova senha"
                            required
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                          >
                            {showConfirmPassword ? <IoEyeOffSharp size={20} /> : <IoEyeSharp size={20} />}
                          </button>
                        </div>
                      </div>

                      <Button
                        type="submit"
                        className="w-full bg-gradient-to-r from-[#09bc8a] to-[#0c1b33] text-white hover:opacity-90 text-base h-11 mt-2"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                          "Redefinir Senha"
                        )}
                      </Button>
                    </div>
                  </form>
                )}

                <div className="mt-4 text-center text-base">
                  <Link 
                    href="/login" 
                    className="text-[#2b866c] hover:text-[#0c1b33] font-medium underline underline-offset-4"
                  >
                    Voltar para o login
                  </Link>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </>
  );
}
"use client"

import { useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { FaArrowRightToBracket } from "react-icons/fa6"
import { IoEyeSharp, IoEyeOffSharp } from "react-icons/io5"
import { toast, Toaster } from "sonner"
import api from "@/app/utils/axiosInstance"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"form">) {
  const [formData, setFormData] = useState({
    email: "",
    senha: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [emailError, setEmailError] = useState("")

  const router = useRouter()

  const validateEmail = (email: string) => {
    if (!email) return "O e-mail é obrigatório"
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "Por favor, insira um e-mail válido"
    return ""
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    
    // Validar e-mail em tempo real
    if (name === "email") {
      setEmailError(validateEmail(value))
    }
  }

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    if (e.target.name === "email") {
      setEmailError(validateEmail(e.target.value))
    }
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validar campos antes de enviar
    const emailValidation = validateEmail(formData.email)
    setEmailError(emailValidation)
    
    if (emailValidation) {
      toast.error("Corrija os erros antes de continuar")
      return
    }

    setIsLoading(true)

    try {
      const response = await api.post("/auth/login", {
        email: formData.email,
        senha: formData.senha,
      });

      if (response.status === 200) {
        router.push("/teste")
      }
    } catch (error: any) {
      toast.error("Erro ao fazer login", {
        description: error.response?.data?.message || "Ocorreu um erro ao tentar fazer login.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form className={cn("flex flex-col gap-6", className)} onSubmit={handleLogin} {...props}>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold text-gray-800">Faça seu login!</h1>
        <p className="text-base text-gray-600">
          Entre com seu e-mail e senha para acessar sua conta.
        </p>
      </div>

      <div className="grid gap-6">
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
            onBlur={handleBlur}
            className={`bg-[#f9f9f9] border ${emailError ? "border-red-500" : "border-gray-300 focus:border-[#09bc8a]"} focus:ring-0 transition-all text-base h-11`}
            required
          />
          {emailError && (
            <p className="text-sm text-red-600">{emailError}</p>
          )}
        </div>

        <div className="grid gap-3">
          <div className="flex items-center">
            <Label htmlFor="password" className="text-gray-700 text-base">
              Senha
            </Label>
            <Link href="#" className="ml-auto text-base font-medium text-[#2b866c] hover:text-[#0c1b33] underline-offset-4 hover:underline">
              Esqueceu sua senha?
            </Link>
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

      <div className="text-center text-base">
        Não tem uma conta?{" "}
        <Link href="/register" className="text-[#2b866c] hover:text-[#0c1b33] font-medium underline underline-offset-4" scroll={false}>
          Cadastre-se
        </Link>
      </div>
    </form>
  )
}

export default function LoginPage() {
  const pathname = usePathname()

  return (
    <>
      {/* Fundo para mobile (igual ao cadastro) */}
      <div className="fixed inset-0 -z-10 lg:hidden">
        <img
          src="/img/fundo-cadastro.jpg"
          alt="Imagem de fundo"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-[#09bc8a]/50"></div>
      </div>

      {/* Layout principal */}
      <div className="grid min-h-svh lg:grid-cols-2">
        {/* Coluna do Formulário */}
        <div className="flex flex-col gap-6 p-8 md:p-10 bg-white lg:bg-transparent rounded-xl lg:rounded-none shadow-xl lg:shadow-none mx-auto my-4 lg:my-0 max-w-sm lg:max-w-none">
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
                <LoginForm />
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Coluna da Imagem */}
        <div className="relative hidden lg:block overflow-hidden">
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

        {/* Toaster */}
        <div className="fixed top-4 right-0 z-50 max-w-[calc(100%-32px)] flex justify-end">
          <Toaster 
            position="bottom-right"
            toastOptions={{
              unstyled: true,
              classNames: {
                title: "font-bold text-sm",
                description: "text-sm",
                toast: "flex items-center p-4 rounded-md shadow-lg gap-4 max-w-[320px]",
                error: "bg-red-400 text-white",
                success: "bg-green-400 text-white",
              },
            }}
          />
        </div>
      </div>
    </>
  )
}
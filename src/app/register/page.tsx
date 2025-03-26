"use client"

import { useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { FaArrowRightToBracket, FaArrowRight, FaArrowLeft } from "react-icons/fa6"
import { FcGoogle } from "react-icons/fc"
import { FaFacebook } from "react-icons/fa"
import { IoEyeSharp, IoEyeOffSharp } from "react-icons/io5"
import { Toaster } from "@/components/ui/sonner"
import api from "@/app/utils/axiosInstance"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    telefone: "",
    data_nascimento: "",
    cpf_cnpj: "",
    fantasia: "",
    regime: "",
    senha: "",
    confirmar_senha: ""
  })

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [personType, setPersonType] = useState("fisica")
  const [currentPage, setCurrentPage] = useState(1)
  const [termsAccepted, setTermsAccepted] = useState(false)
  const [angle, setAngle] = useState(0)
  const totalPages = personType === "fisica" ? 2 : 2

  const router = useRouter()

  useEffect(() => {
    const animationFrame = requestAnimationFrame(function animate() {
      setAngle(prev => (prev + 0.5) % 360)
      requestAnimationFrame(animate)
    })
    return () => cancelAnimationFrame(animationFrame)
  }, [])

  const formatCPF = (value: string): string => {
    const numbers = value.replace(/\D/g, "")
    if (numbers.length <= 11) {
      return numbers
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d{1,2})$/, "$1-$2")
    }
    return value
  }

  const formatCNPJ = (value: string): string => {
    const numbers = value.replace(/\D/g, "")
    if (numbers.length <= 14) {
      return numbers
        .replace(/(\d{2})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d)/, "$1/$2")
        .replace(/(\d{4})(\d{1,2})$/, "$1-$2")
    }
    return value
  }

  const formatPhone = (value: string): string => {
    const numbers = value.replace(/\D/g, "")
    if (numbers.length === 11) {
      return numbers.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3")
    }
    return value
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage(null)

    if (formData.senha !== formData.confirmar_senha) {
      setMessage("As senhas não coincidem")
      setIsLoading(false)
      return
    }

    try {
      const dataToSend = {
        ...formData,
        tipo: personType,
      }

      const response = await api.post("/users/", dataToSend)
      console.log("Resposta do servidor:", response.data)

      if (response.status === 201 || response.status === 200) {
        router.push("/pages/home")
        setFormData({
          nome: "",
          email: "",
          telefone: "",
          data_nascimento: "",
          cpf_cnpj: "",
          fantasia: "",
          regime: "",
          senha: "",
          confirmar_senha: ""
        })
      }
    } catch (error: any) {
      console.error("Erro na requisição:", error)
      setMessage(error.response?.data?.message || "Erro ao conectar-se ao servidor.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    let formattedValue = value

    if (name === "cpf_cnpj") {
      formattedValue = personType === "fisica" ? formatCPF(value) : formatCNPJ(value)
    } else if (name === "telefone") {
      formattedValue = formatPhone(value)
    }

    setFormData({ ...formData, [name]: formattedValue })
    setMessage(null)
  }

  const handlePersonTypeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPersonType(e.target.value)
    setFormData({
      ...formData,
      cpf_cnpj: "",
      fantasia: "",
      regime: "",
    })
  }

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1)
    }
  }

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
    }
  }

  const renderFormFields = () => {
    if (currentPage === 2) {
      return (
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Confirmação de Dados</h3>
          
          <div className="bg-gray-50 p-4 rounded-md">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Nome</p>
                <p className="font-medium">{formData.nome}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">E-mail</p>
                <p className="font-medium">{formData.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Telefone</p>
                <p className="font-medium">{formData.telefone}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">{personType === "fisica" ? "CPF" : "CNPJ"}</p>
                <p className="font-medium">{formData.cpf_cnpj}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">{personType === "fisica" ? "Data Nasc." : "Data Fundação"}</p>
                <p className="font-medium">{formData.data_nascimento}</p>
              </div>
              {personType === "juridica" && (
                <>
                  <div>
                    <p className="text-sm text-gray-500">Nome Fantasia</p>
                    <p className="font-medium">{formData.fantasia || "-"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Regime Tributário</p>
                    <p className="font-medium">{formData.regime || "-"}</p>
                  </div>
                </>
              )}
            </div>
          </div>

          {personType === "fisica" && (
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div>
                <p className="text-sm text-gray-500">Senha</p>
                <p className="font-medium">••••••••</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Confirmar Senha</p>
                <p className="font-medium">••••••••</p>
              </div>
            </div>
          )}

          <div className="mt-4">
            <label className="flex items-start">
              <input
                type="checkbox"
                className="mt-1 form-checkbox h-4 w-4 text-[#09bc8a]"
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
                required
              />
              <span className="ml-2 text-sm">
                Concordo com os <a href="#" className="text-[#09bc8a]">Termos de Uso</a> e{' '}
                <a href="#" className="text-[#09bc8a]">Política de Privacidade</a>
              </span>
            </label>
          </div>
        </div>
      )
    }

    return (
      <>
        <div className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <Label htmlFor="nome" className="text-gray-700 text-base">
                Nome {personType === "juridica" ? "da Empresa" : ""} <span className="text-red-500">*</span>
              </Label>
              <Input
                id="nome"
                name="nome"
                type="text"
                value={formData.nome}
                onChange={handleChange}
                placeholder="Digite seu nome completo"
                required
              />
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
              <Label htmlFor="email" className="text-gray-700 text-base">
                E-mail <span className="text-red-500">*</span>
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="m@example.com"
                required
              />
            </div>
            <div className="flex-1">
              <Label htmlFor="telefone" className="text-gray-700 text-base">
                Telefone <span className="text-red-500">*</span>
              </Label>
              <Input
                id="telefone"
                name="telefone"
                type="text"
                value={formData.telefone}
                onChange={handleChange}
                placeholder="(XX) XXXXX-XXXX"
                maxLength={15}
                required
              />
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
              <Label htmlFor="cpf_cnpj" className="text-gray-700 text-base">
                {personType === "fisica" ? "CPF" : "CNPJ"} <span className="text-red-500">*</span>
              </Label>
              <Input
                id="cpf_cnpj"
                name="cpf_cnpj"
                type="text"
                value={formData.cpf_cnpj}
                onChange={handleChange}
                placeholder={personType === "fisica" ? "Digite seu CPF" : "Digite o CNPJ"}
                maxLength={personType === "fisica" ? 14 : 18}
                required
              />
            </div>
            <div className="flex-1">
              <Label htmlFor="data_nascimento" className="text-gray-700 text-base">
                {personType === "fisica" ? "Data de Nascimento" : "Data de Fundação"} <span className="text-red-500">*</span>
              </Label>
              <Input
                id="data_nascimento"
                name="data_nascimento"
                type="date"
                value={formData.data_nascimento}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {personType === "juridica" && (
            <div className="flex gap-4">
              <div className="flex-1">
                <Label htmlFor="fantasia" className="text-gray-700 text-base">
                  Nome Fantasia
                </Label>
                <Input
                  id="fantasia"
                  name="fantasia"
                  type="text"
                  value={formData.fantasia}
                  onChange={handleChange}
                  placeholder="Digite o Nome Fantasia"
                />
              </div>
              <div className="flex-1">
                <Label htmlFor="regime" className="text-gray-700 text-base">
                  Regime Tributário
                </Label>
                <Input
                  id="regime"
                  name="regime"
                  type="text"
                  value={formData.regime}
                  onChange={handleChange}
                  placeholder="Digite o Regime Tributário"
                />
              </div>
            </div>
          )}

          {personType === "fisica" && (
            <div className="flex gap-4">
              <div className="flex-1">
                <Label htmlFor="senha" className="text-gray-700 text-base">
                  Senha <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <Input
                    id="senha"
                    name="senha"
                    type={showPassword ? "text" : "password"}
                    value={formData.senha}
                    onChange={handleChange}
                    placeholder="Digite sua senha"
                    required
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? <IoEyeOffSharp size={20} /> : <IoEyeSharp size={20} />}
                  </button>
                </div>
              </div>
              <div className="flex-1">
                <Label htmlFor="confirmar_senha" className="text-gray-700 text-base">
                  Confirmar Senha <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <Input
                    id="confirmar_senha"
                    name="confirmar_senha"
                    type={showConfirmPassword ? "text" : "password"}
                    value={formData.confirmar_senha}
                    onChange={handleChange}
                    placeholder="Confirme sua senha"
                    required
                    className="pr-10"
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
            </div>
          )}

          <div className="mt-4">
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="tipoPessoa"
                value="fisica"
                checked={personType === "fisica"}
                onChange={handlePersonTypeChange}
                className="form-radio h-4 w-4 text-[#09bc8a]"
              />
              <span className="ml-2">Pessoa Física</span>
            </label>
            <label className="inline-flex items-center ml-6">
              <input
                type="radio"
                name="tipoPessoa"
                value="juridica"
                checked={personType === "juridica"}
                onChange={handlePersonTypeChange}
                className="form-radio h-4 w-4 text-[#09bc8a]"
              />
              <span className="ml-2">Pessoa Jurídica</span>
            </label>
          </div>
        </div>
      </>
    )
  }

  const renderNavigationButtons = () => {
    return (
      <div className="mt-6 flex justify-between">
        {currentPage > 1 && (
          <Button
            type="button"
            onClick={prevPage}
            className="flex items-center gap-2 bg-gradient-to-r from-[#09bc8a] to-[#0c1b33] text-white hover:opacity-90"
          >
            <FaArrowLeft /> Voltar
          </Button>
        )}

        {currentPage < totalPages ? (
          <Button
            type="button"
            onClick={nextPage}
            className="flex items-center gap-2 ml-auto bg-gradient-to-r from-[#09bc8a] to-[#0c1b33] text-white hover:opacity-90 "
          >
            Próximo <FaArrowRight />
          </Button>
        ) : (
          <Button
            type="submit"
            className="flex items-center gap-2 ml-auto bg-gradient-to-r from-[#09bc8a] to-[#0c1b33] text-white hover:opacity-90"
            disabled={isLoading || !termsAccepted}
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                Cadastrar <FaArrowRightToBracket />
              </>
            )}
          </Button>
        )}
      </div>
    )
  }

  return (
    <div className="w-full max-w-4/5 relative rounded-lg">
      <div className="absolute -inset-[3px] rounded-lg overflow-hidden">
        <div 
          className="absolute inset-0 rounded-lg"
          style={{
            background: `conic-gradient(from ${angle}deg, rgba(0,0,0,0) 20%, #09bc8a 50%, rgba(0,0,0,0) 80%)`,
            zIndex: 0,
            padding: '3px'
          }}
        />
        <div className="absolute inset-0 rounded-lg border-2 border-gray-200 z-0" />
      </div>
      
      <div className="relative bg-white rounded-lg p-6 z-10 border border-gray-200">
        <h2 className="text-2xl font-bold text-center mb-6">Criar Conta</h2>
        
        {personType === "fisica" && currentPage === 1 && (
          <>
            <div className="mb-6">
              <Button 
                type="button"
                variant="outline"
                className="w-full flex items-center justify-center gap-2 mb-3"
              >
                <FcGoogle /> Continuar com Google
              </Button>
              <Button 
                type="button"
                className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white hover:bg-blue-700"
              >
                <FaFacebook /> Continuar com Facebook
              </Button>
            </div>
          </>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {renderFormFields()}
          {renderNavigationButtons()}
          {message && <p className="text-red-500 text-sm mt-4">{message}</p>}
        </form>

        {currentPage === 1 && (
          <p className="mt-6 text-center text-base font-medium text-black">
            Já tem uma conta?{' '}
            <Link
              href="/login"
              className="text-[#09bc8a] hover:underline hover:text-[#000000] underline decoration-solid"
              scroll={false}
            >
              Faça login
            </Link>
          </p>
        )}
      </div>
    </div>
  )
}

export default function RegisterPage() {
  const pathname = usePathname()

  return (
    <>
      {/* Fundo para mobile (sem animação) */}
      <div className="fixed inset-0 -z-10 lg:hidden">
        <img
          src="/img/fundo-cadastro.jpg"
          alt="Imagem de fundo"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-[#09bc8a]/50"></div>
      </div>

      {/* Layout principal */}
      <div className="grid min-h-screen lg:grid-cols-[1fr_1.2fr]">
        {/* Coluna da Imagem (com animação) */}
        <div className="relative hidden lg:block order-first overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={pathname}
              initial={{ x: pathname === "/login" ? "-100%" : "100%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: pathname === "/login" ? "100%" : "-100%", opacity: 0 }}
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

        {/* Coluna do Formulário (com animação) */}
        <div className="flex flex-col gap-6 p-4 md:p-6 lg:p-8 max-[1024px]:bg-white max-[1024px]:rounded-xl max-[1024px]:shadow-xl max-[1024px]:mx-auto max-[1024px]:my-4 max-[1024px]:max-w-2xl order-last">
          <AnimatePresence mode="wait">
            <motion.div
              key={pathname}
              initial={{ x: pathname === "/login" ? "100%" : "-100%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: pathname === "/login" ? "-100%" : "100%", opacity: 0 }}
              transition={{ duration: 0.7, ease: "easeInOut" }}
              className="flex flex-1 items-center justify-center p-2"
            >
              <RegisterForm />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <div className="fixed top-4 right-4 z-50">
        <Toaster
          toastOptions={{
            unstyled: true,
            classNames: {
              title: "font-bold text-sm max-[600px]:text-xs",
              description: "text-sm max-[600px]:text-xs",
              toast: "ml-auto max-sm:mr-8 flex items-center p-4 rounded-md shadow-lg gap-4 max-w-[320px] max-sm:max-w-[290px]",
              error: "bg-red-400 text-white",
              success: "bg-green-400 text-white",
              warning: "bg-yellow-400 text-black",
              info: "bg-blue-400 text-white",
            },
          }}
        />
      </div>
    </>
  )
}
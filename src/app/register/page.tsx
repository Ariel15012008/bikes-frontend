"use client"

import type React from "react"

import { useState, useEffect, useMemo, useCallback } from "react"
import { useRouter, usePathname } from "next/navigation"
import { toast, Toaster } from "sonner"
import { motion, AnimatePresence } from "framer-motion"
import api from "@/app/utils/axiosInstance"
import PessoaFisicaForm from "@/components/pessoaFisicaForm"

type DeviceType = "mobile" | "tablet" | "laptop" | "desktop"

const useDeviceType = (): DeviceType => {
  const [deviceType, setDeviceType] = useState<DeviceType>("desktop")

  useEffect(() => {
    const checkDeviceType = () => {
      const width = window.innerWidth
      if (width < 768) setDeviceType("mobile")
      else if (width >= 768 && width < 1024) setDeviceType("tablet")
      else if (width >= 1024 && width < 1440) setDeviceType("laptop")
      else setDeviceType("desktop")
    }

    checkDeviceType()
    window.addEventListener("resize", checkDeviceType)
    return () => window.removeEventListener("resize", checkDeviceType)
  }, [])

  return deviceType
}

export default function RegisterPage() {
  const pathname = usePathname()
  const router = useRouter()
  const deviceType = useDeviceType()
  const [currentPage, setCurrentPage] = useState(1)
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [termsAccepted, setTermsAccepted] = useState(false)

  // Mantendo a estrutura original completa do formData
  const [formData, setFormData] = useState({
    nome_completo: "",
    email: "",
    telefone_celular: "",
    data_nascimento: "",
    cpf_cnpj: "",
    fantasia: "",
    regime: "",
    senha: "",
  })

  const [errors, setErrors] = useState({
    nome_completo: "",
    email: "",
    telefone_celular: "",
    regime: "",
  })

  // Validações
  const validarNome = (nome: string) => {
    if (nome.trim() === "") return "O nome é obrigatório"
    if (/\d/.test(nome)) return "O nome não pode conter números"
    return ""
  }

  const validarEmail = (email: string) => {
    if (email.trim() === "") return "O e-mail é obrigatório"
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "Por favor, insira um e-mail válido"
    return ""
  }

  const validarTelefone = (telefone: string) => {
    const numbers = telefone.replace(/\D/g, "")
    if (numbers.length !== 11) return "Telefone inválido (deve ter 11 dígitos)"
    if (/[a-zA-Z]/.test(telefone)) return "O telefone não pode conter letras"
    return ""
  }

  const totalPages = 2

  const validateCurrentPage = useMemo(() => {
    if (currentPage === 1) {
      const nomeValido = validarNome(formData.nome_completo) === ""
      const emailValido = validarEmail(formData.email) === ""
      const telefoneValido = validarTelefone(formData.telefone_celular) === ""
      const cpfCnpjValido = formData.cpf_cnpj.replace(/\D/g, "").length === 11
      const dataValida = formData.data_nascimento.trim() !== ""
      const senhaValida = formData.senha.trim() !== ""

      return nomeValido && emailValido && telefoneValido && cpfCnpjValido && dataValida && senhaValida
    }
    return true
  }, [currentPage, formData])

  const formatCPF = useCallback((value: string): string => {
    const numbers = value.replace(/\D/g, "")
    if (numbers.length <= 11) {
      return numbers
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d{1,2})$/, "$1-$2")
    }
    return value
  }, [])

  const formatPhone = useCallback((value: string): string => {
    const numbers = value.replace(/\D/g, "")
    if (numbers.length === 11) {
      return numbers.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3")
    }
    return value
  }, [])

  const cleanNumber = useCallback((value: string): string => value.replace(/\D/g, ""), [])

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()

      if (!termsAccepted) {
        toast.error("Você precisa aceitar os termos de uso")
        return
      }

      // Validar todos os campos antes de enviar
      const novosErros = {
        nome_completo: validarNome(formData.nome_completo),
        email: validarEmail(formData.email),
        telefone_celular: validarTelefone(formData.telefone_celular),
        regime: "", // Mantendo a estrutura original
      }

      setErrors(novosErros)

      const temErros = Object.values(novosErros).some((error) => error !== "")
      if (temErros) {
        toast.error("Corrija os erros antes de enviar")
        return
      }

      setIsLoading(true)

      try {
        const response = await api.post("/users/", {
          pessoa: {
            nome_completo: formData.nome_completo,
            fantasia: formData.fantasia,
            cpf_cnpj: cleanNumber(formData.cpf_cnpj),
            email: formData.email,
            telefone_celular: cleanNumber(formData.telefone_celular),
            data_nascimento: formData.data_nascimento,
            regime: formData.regime,
            tipo_pessoa: "fisica",
          },
          usuario: {
            email: formData.email,
            senha: formData.senha,
          },
        })

        if (response.status === 201 || response.status === 200) {
          toast.success("Cadastro realizado com sucesso!")
          router.push("/", { scroll: false })
          setFormData({
            nome_completo: "",
            email: "",
            telefone_celular: "",
            data_nascimento: "",
            cpf_cnpj: "",
            fantasia: "",
            regime: "",
            senha: "",
          })
        }
      } catch (error: any) {
        console.error("Erro na requisição:", error)
        if (
          error.response?.data?.detail?.includes("Email já cadastrado") ||
          error.response?.data?.message?.includes("Email já cadastrado")
        ) {
          // Mensagem genérica para email já cadastrado
          toast.error("Erro ao cadastrar")
        } else {
          // Mostra outras mensagens de erro normalmente
          const errorMessage =
            error.response?.data?.detail || error.response?.data?.message || "Ocorreu um erro ao tentar se cadastrar."
          toast.error("Erro ao cadastrar", {
            description: errorMessage,
          })
        }
      } finally {
        setIsLoading(false)
      }
    },
    [formData, termsAccepted, router, cleanNumber],
  )

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target
      let formattedValue = value

      if (name === "cpf_cnpj") {
        formattedValue = formatCPF(value)
      } else if (name === "telefone_celular") {
        formattedValue = formatPhone(value)
      }

      setFormData((prev) => ({ ...prev, [name]: formattedValue }))

      // Limpar erro quando o usuário começa a digitar
      if (errors[name as keyof typeof errors]) {
        setErrors((prev) => ({ ...prev, [name]: "" }))
      }
    },
    [formatCPF, formatPhone, errors],
  )

  const handleBlur = useCallback((e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target

    let error = ""
    switch (name) {
      case "nome_completo":
        error = validarNome(value)
        break
      case "email":
        error = validarEmail(value)
        break
      case "telefone_celular":
        error = validarTelefone(value)
        break
      default:
        break
    }

    setErrors((prev) => ({ ...prev, [name]: error }))
  }, [])

  const nextPage = useCallback(() => {
    if (!validateCurrentPage) {
      toast.error("Preencha todos os campos obrigatórios corretamente")
      return
    }
    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
  }, [validateCurrentPage, totalPages])

  const prevPage = useCallback(() => {
    setCurrentPage((prev) => Math.max(prev - 1, 1))
  }, [])

  const shouldShowSplitLayout = useMemo(() => deviceType === "laptop" || deviceType === "desktop", [deviceType])

  const animationDuration = useMemo(() => {
    switch (deviceType) {
      case "mobile":
        return 0
      case "tablet":
        return 0.3
      default:
        return 0.7
    }
  }, [deviceType])

  return (
    <>
      {(deviceType === "mobile" || deviceType === "tablet") && (
        <div className="fixed inset-0 -z-10">
          <img
            src="/img/fundo-cadastro.jpg"
            alt="Imagem de fundo"
            className="h-full w-full object-cover"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-[#09bc8a]/50"></div>
        </div>
      )}

      <div className={`grid min-h-screen ${shouldShowSplitLayout ? "lg:grid-cols-[1fr_1.2fr]" : ""}`}>
        {shouldShowSplitLayout && (
          <div className="relative hidden lg:block order-first overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={pathname}
                initial={{
                  x: pathname === "/login" ? "-100%" : "100%",
                  opacity: 0,
                }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: pathname === "/login" ? "100%" : "-100%", opacity: 0 }}
                transition={{ duration: animationDuration, ease: "easeInOut" }}
                className="absolute inset-0"
              >
                <img
                  src="/img/fundo-cadastro.jpg"
                  alt="Imagem de fundo"
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-[#09bc8a]/50"></div>
              </motion.div>
            </AnimatePresence>
          </div>
        )}

        <div
          className={`flex flex-col gap-6 p-4 w-full max-w-[95vw] mx-auto my-4 ${
            shouldShowSplitLayout ? "lg:max-w-2xl lg:p-8" : ""
          } order-last`}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={pathname}
              initial={{
                x: deviceType === "mobile" ? 0 : pathname === "/login" ? "100%" : "-100%",
                opacity: deviceType === "mobile" ? 1 : 0,
              }}
              animate={{ x: 0, opacity: 1 }}
              exit={{
                x: deviceType === "mobile" ? 0 : pathname === "/login" ? "-100%" : "100%",
                opacity: deviceType === "mobile" ? 1 : 0,
              }}
              transition={{ duration: animationDuration, ease: "easeInOut" }}
              className="flex flex-1 items-center justify-center p-2 w-full"
            >
              <div
                className={`w-full ${
                  deviceType === "mobile"
                    ? "max-w-[95vw]"
                    : deviceType === "tablet"
                      ? "max-w-[90vw]"
                      : deviceType === "laptop"
                        ? "max-w-[85vw]"
                        : "max-w-[800px]"
                } relative rounded-lg mx-auto`}
              >
                <div
                  className={`relative bg-white rounded-lg ${
                    deviceType === "mobile" ? "p-4" : "p-6"
                  } z-10 border border-gray-200 w-full`}
                >
                  <h2 className={`${deviceType === "mobile" ? "text-xl" : "text-2xl"} font-bold text-center mb-6`}>
                    Criar Conta
                  </h2>

                  <PessoaFisicaForm
                    formData={formData}
                    errors={errors}
                    deviceType={deviceType}
                    currentPage={currentPage}
                    totalPages={totalPages}
                    showPassword={showPassword}
                    isLoading={isLoading}
                    termsAccepted={termsAccepted}
                    validateCurrentPage={validateCurrentPage}
                    handleChange={handleChange}
                    handleBlur={handleBlur}
                    setShowPassword={setShowPassword}
                    setTermsAccepted={setTermsAccepted}
                    nextPage={nextPage}
                    prevPage={prevPage}
                    handleSubmit={handleSubmit}
                  />
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <div className={`fixed ${deviceType === "mobile" ? "top-2" : "top-4"} right-0 z-50 max-w-[calc(100%-32px)] flex`}>
        <Toaster
          position={deviceType === "mobile" ? "top-center" : "bottom-right"}
          toastOptions={{
            unstyled: true,
            classNames: {
              title: `${deviceType === "mobile" ? "text-xs" : "text-sm"} font-bold`,
              description: deviceType === "mobile" ? "text-xs" : "text-sm",
              toast: `flex items-center p-4 rounded-md shadow-lg gap-4 ${
                deviceType === "mobile" ? "max-w-[280px]" : "max-w-[320px]"
              }`,
              error: "bg-red-400 text-white",
              success: "bg-green-400 text-white",
            },
          }}
        />
      </div>
    </>
  )
}

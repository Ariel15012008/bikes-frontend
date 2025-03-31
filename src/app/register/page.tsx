"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  FaArrowRightToBracket,
  FaArrowRight,
  FaArrowLeft,
} from "react-icons/fa6";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa";
import { IoEyeSharp, IoEyeOffSharp } from "react-icons/io5";
import { toast, Toaster } from "sonner";
import api from "@/app/utils/axiosInstance";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

type DeviceType = "mobile" | "tablet" | "laptop" | "desktop";

const useDeviceType = (): DeviceType => {
  const [deviceType, setDeviceType] = useState<DeviceType>("desktop");

  useEffect(() => {
    const checkDeviceType = () => {
      const width = window.innerWidth;
      if (width < 768) setDeviceType("mobile");
      else if (width >= 768 && width < 1024) setDeviceType("tablet");
      else if (width >= 1024 && width < 1440) setDeviceType("laptop");
      else setDeviceType("desktop");
    };

    checkDeviceType();
    window.addEventListener("resize", checkDeviceType);
    return () => window.removeEventListener("resize", checkDeviceType);
  }, []);

  return deviceType;
};

// Opções de regime tributário
const regimesTributarios = ["MEI", "Simples Nacional", "Lucro Real", "Lucro Presumido"];

const RegisterForm = ({ deviceType }: { deviceType: DeviceType }) => {
  const [formData, setFormData] = useState({
    nome_completo: "",
    email: "",
    telefone_celular: "",
    data_nascimento: "",
    cpf_cnpj: "",
    fantasia: "",
    regime: "",
    senha: "",
  });

  const [errors, setErrors] = useState({
    nome_completo: "",
    email: "",
    telefone_celular: "",
    regime: ""
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [personType, setPersonType] = useState("fisica");
  const [currentPage, setCurrentPage] = useState(1);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [showRegimeOptions, setShowRegimeOptions] = useState(false);
  const [filteredRegimes, setFilteredRegimes] = useState(regimesTributarios);
  const router = useRouter();

  // Validações
  const validarNome = (nome: string) => {
    if (nome.trim() === "") return "O nome é obrigatório";
    if (/\d/.test(nome)) return "O nome não pode conter números";
    return "";
  };

  const validarEmail = (email: string) => {
    if (email.trim() === "") return "O e-mail é obrigatório";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "Por favor, insira um e-mail válido";
    return "";
  };

  const validarTelefone = (telefone: string) => {
    const numbers = telefone.replace(/\D/g, "");
    if (numbers.length !== 11) return "Telefone inválido (deve ter 11 dígitos)";
    if (/[a-zA-Z]/.test(telefone)) return "O telefone não pode conter letras";
    return "";
  };

  const validarRegime = (regime: string) => {
    if (regime.trim() === "") return "O regime tributário é obrigatório";
    if (!regimesTributarios.includes(regime)) return "Selecione um regime válido";
    return "";
  };

  // Filtrar regimes conforme digitação
  const filtrarRegimes = (valor: string) => {
    if (valor === "") {
      setFilteredRegimes(regimesTributarios);
      return;
    }
    const filtrados = regimesTributarios.filter(regime =>
      regime.toLowerCase().includes(valor.toLowerCase())
    );
    setFilteredRegimes(filtrados);
  };

  const totalPages = useMemo(() => (personType === "fisica" ? 2 : 2), [personType]);

  const validateCurrentPage = useMemo(() => {
    if (currentPage === 1) {
      const nomeValido = validarNome(formData.nome_completo) === "";
      const emailValido = validarEmail(formData.email) === "";
      const telefoneValido = validarTelefone(formData.telefone_celular) === "";
      const cpfCnpjValido = formData.cpf_cnpj.replace(/\D/g, "").length === (personType === "fisica" ? 11 : 14);
      const dataValida = formData.data_nascimento.trim() !== "";
      const senhaValida = formData.senha.trim() !== "";

      if (personType === "juridica") {
        const regimeValido = validarRegime(formData.regime) === "";
        const fantasiaValido = formData.fantasia.trim() !== "";
        return nomeValido && emailValido && telefoneValido && cpfCnpjValido && 
               dataValida && senhaValida && regimeValido && fantasiaValido;
      }
      return nomeValido && emailValido && telefoneValido && cpfCnpjValido && dataValida && senhaValida;
    }
    return true;
  }, [currentPage, formData, personType]);

  const formatCPF = useCallback((value: string): string => {
    const numbers = value.replace(/\D/g, "");
    if (numbers.length <= 11) {
      return numbers
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
    }
    return value;
  }, []);

  const formatCNPJ = useCallback((value: string): string => {
    const numbers = value.replace(/\D/g, "");
    if (numbers.length <= 14) {
      return numbers
        .replace(/(\d{2})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d)/, "$1/$2")
        .replace(/(\d{4})(\d{1,2})$/, "$1-$2");
    }
    return value;
  }, []);

  const formatPhone = useCallback((value: string): string => {
    const numbers = value.replace(/\D/g, "");
    if (numbers.length === 11) {
      return numbers.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
    }
    return value;
  }, []);

  const cleanNumber = useCallback((value: string): string => value.replace(/\D/g, ""), []);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!termsAccepted) {
      toast.error("Você precisa aceitar os termos de uso");
      return;
    }

    // Validar todos os campos antes de enviar
    const novosErros = {
      nome_completo: validarNome(formData.nome_completo),
      email: validarEmail(formData.email),
      telefone_celular: validarTelefone(formData.telefone_celular),
      regime: personType === "juridica" ? validarRegime(formData.regime) : ""
    };

    setErrors(novosErros);

    const temErros = Object.values(novosErros).some(error => error !== "");
    if (temErros) {
      toast.error("Corrija os erros antes de enviar");
      return;
    }

    setIsLoading(true);

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
          tipo_pessoa: personType,
        },
        usuario: {
          email: formData.email,
          senha: formData.senha,
        },
      });

      if (response.status === 201 || response.status === 200) {
        toast.success("Cadastro realizado com sucesso!");
        router.push("/", { scroll: false });
        setFormData({
          nome_completo: "",
          email: "",
          telefone_celular: "",
          data_nascimento: "",
          cpf_cnpj: "",
          fantasia: "",
          regime: "",
          senha: "",
        });
      }
    } catch (error: any) {
      console.error("Erro na requisição:", error);
      if (
        error.response?.data?.detail?.includes("Email já cadastrado") ||
        error.response?.data?.message?.includes("Email já cadastrado")
      ) {
        // Mensagem genérica para email já cadastrado
        toast.error("Erro ao cadastrar");
      } else {
        // Mostra outras mensagens de erro normalmente 
        const errorMessage = error.response?.data?.detail || error.response?.data?.message || "Ocorreu um erro ao tentar se cadastrar.";
        toast.error("Erro ao cadastrar", {
          description: errorMessage,
        });
      }
    } finally {
      setIsLoading(false);
    }
  }, [formData, termsAccepted, personType, router, cleanNumber]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let formattedValue = value;

    if (name === "cpf_cnpj") {
      formattedValue = personType === "fisica" ? formatCPF(value) : formatCNPJ(value);
    } else if (name === "telefone_celular") {
      formattedValue = formatPhone(value);
    } else if (name === "regime") {
      filtrarRegimes(value);
    }

    setFormData(prev => ({ ...prev, [name]: formattedValue }));
    
    // Limpar erro quando o usuário começa a digitar
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  }, [personType, formatCPF, formatCNPJ, formatPhone, errors]);

  const handleBlur = useCallback((e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    let error = "";
    switch (name) {
      case "nome_completo":
        error = validarNome(value);
        break;
      case "email":
        error = validarEmail(value);
        break;
      case "telefone_celular":
        error = validarTelefone(value);
        break;
      case "regime":
        error = validarRegime(value);
        break;
      default:
        break;
    }

    setErrors(prev => ({ ...prev, [name]: error }));
  }, []);

  const selecionarRegime = (regime: string) => {
    setFormData(prev => ({ ...prev, regime }));
    setShowRegimeOptions(false);
    setErrors(prev => ({ ...prev, regime: "" }));
  };

  const nextPage = useCallback(() => {
    if (!validateCurrentPage) {
      toast.error("Preencha todos os campos obrigatórios corretamente");
      return;
    }
    setCurrentPage(prev => Math.min(prev + 1, totalPages));
  }, [validateCurrentPage, totalPages]);

  const prevPage = useCallback(() => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
  }, []);

  const renderFormFields = useMemo(() => {
    if (currentPage === 2) {
      return (
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Confirmação de Dados</h3>
          <div className="bg-gray-50 p-4 rounded-md">
            <div className={`grid ${deviceType === "mobile" ? "grid-cols-1" : "grid-cols-2"} gap-4`}>
              <div className="break-words overflow-hidden">
                <p className="text-sm text-gray-500">Nome</p>
                <p className="font-medium break-all">{formData.nome_completo}</p>
              </div>
              <div className="break-words overflow-hidden">
                <p className="text-sm text-gray-500">E-mail</p>
                <p className="font-medium break-all">{formData.email}</p>
              </div>
              <div className="break-words overflow-hidden">
                <p className="text-sm text-gray-500">Telefone</p>
                <p className="font-medium break-all">{formData.telefone_celular}</p>
              </div>
              <div className="break-words overflow-hidden">
                <p className="text-sm text-gray-500">
                  {personType === "fisica" ? "CPF" : "CNPJ"}
                </p>
                <p className="font-medium break-all">{formData.cpf_cnpj}</p>
              </div>
              <div className="break-words overflow-hidden">
                <p className="text-sm text-gray-500">
                  {personType === "fisica" ? "Data Nasc." : "Data Fundação"}
                </p>
                <p className="font-medium break-all">{formData.data_nascimento}</p>
              </div>
              {personType === "juridica" && (
                <>
                  <div className="break-words overflow-hidden">
                    <p className="text-sm text-gray-500">Nome Fantasia</p>
                    <p className="font-medium break-all">{formData.fantasia || "-"}</p>
                  </div>
                  <div className="break-words overflow-hidden">
                    <p className="text-sm text-gray-500">Regime Tributário</p>
                    <p className="font-medium break-all">{formData.regime || "-"}</p>
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="mt-4">
            <p className="text-sm text-gray-500">Senha</p>
            <p className="font-medium">••••••••</p>
          </div>

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
                Concordo com os{" "}
                <a href="#" className="text-[#09bc8a]">
                  Termos de Uso
                </a>{" "}
                e{" "}
                <a href="#" className="text-[#09bc8a]">
                  Política de Privacidade
                </a>
              </span>
            </label>
          </div>
        </div>
      );
    }

    return (
      <>
        <div className={`flex justify-center gap-4 ${deviceType === "mobile" ? "mb-4" : "mb-6"}`}>
          <button
            type="button"
            onClick={() => {
              setPersonType("fisica");
              setFormData(prev => ({
                ...prev,
                cpf_cnpj: "",
                fantasia: "",
                regime: "",
              }));
            }}
            className={`px-3 py-1 text-sm rounded border ${
              personType === "fisica"
                ? "border-[#09bc8a] bg-[#09bc8a]/10"
                : "border-gray-300"
            }`}
          >
            Pessoa Física
          </button>
          <button
            type="button"
            onClick={() => {
              setPersonType("juridica");
              setFormData(prev => ({
                ...prev,
                cpf_cnpj: "",
                fantasia: "",
                regime: "",
              }));
            }}
            className={`px-3 py-1 text-sm rounded border ${
              personType === "juridica"
                ? "border-[#09bc8a] bg-[#09bc8a]/10"
                : "border-gray-300"
            }`}
          >
            Pessoa Jurídica
          </button>
        </div>

        {personType === "fisica" && currentPage === 1 && deviceType !== "mobile" && (
          <div className={`mb-3 w-full ${deviceType === "tablet" ? "flex flex-col space-y-2" : ""}`}>
            <Button
              type="button"
              variant="outline"
              className="w-full flex items-center justify-center gap-2 mb-3">
              <FcGoogle /> Continuar com Google
            </Button>
            <Button
              type="button"
              className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white hover:bg-blue-700">
              <FaFacebook /> Continuar com Facebook
            </Button>
          </div>
        )}

        <div className="space-y-4 w-full">
          <div className="w-full">
            <Label htmlFor="nome" className={`${
              deviceType === "mobile" ? "text-sm" : "text-base"
            } text-gray-700`}>
              Nome {personType === "juridica" ? "da Empresa" : ""}{" "}
              <span className="text-red-500">*</span>
            </Label>
            <Input
              id="nome"
              name="nome_completo"
              type="text"
              value={formData.nome_completo}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Digite seu nome completo"
              required
              className={`w-full ${errors.nome_completo ? "border-red-500" : ""}`}
            />
            {errors.nome_completo && (
              <p className="mt-1 text-sm text-red-600">{errors.nome_completo}</p>
            )}
          </div>

          <div className={`flex ${
            deviceType === "mobile" ? "flex-col space-y-4" : 
            "flex-row space-y-0 space-x-4"
          } w-full`}>
            <div className="w-full md:w-1/2">
              <Label htmlFor="email" className={`${
                deviceType === "mobile" ? "text-sm" : "text-base"
              } text-gray-700`}>
                E-mail <span className="text-red-500">*</span>
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="m@example.com"
                required
                className={`w-full ${errors.email ? "border-red-500" : ""}`}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>
            <div className="w-full md:w-1/2">
              <Label htmlFor="telefone" className={`${
                deviceType === "mobile" ? "text-sm" : "text-base"
              } text-gray-700`}>
                Telefone <span className="text-red-500">*</span>
              </Label>
              <Input
                id="telefone"
                name="telefone_celular"
                type="text"
                value={formData.telefone_celular}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="(XX) XXXXX-XXXX"
                maxLength={15}
                required
                className={`w-full ${errors.telefone_celular ? "border-red-500" : ""}`}
              />
              {errors.telefone_celular && (
                <p className="mt-1 text-sm text-red-600">{errors.telefone_celular}</p>
              )}
            </div>
          </div>

          <div className={`flex ${
            deviceType === "mobile" ? "flex-col space-y-4" : 
            "flex-row space-y-0 space-x-4"
          } w-full`}>
            <div className="w-full md:w-1/2">
              <Label htmlFor="cpf_cnpj" className={`${
                deviceType === "mobile" ? "text-sm" : "text-base"
              } text-gray-700`}>
                {personType === "fisica" ? "CPF" : "CNPJ"}{" "}
                <span className="text-red-500">*</span>
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
                className="w-full"
              />
            </div>
            <div className="w-full md:w-1/2">
              <Label htmlFor="data_nascimento" className={`${
                deviceType === "mobile" ? "text-sm" : "text-base"
              } text-gray-700`}>
                {personType === "fisica" ? "Data Nasc." : "Data Fundação"}{" "}
                <span className="text-red-500">*</span>
              </Label>
              <Input
                id="data_nascimento"
                name="data_nascimento"
                type="date"
                value={formData.data_nascimento}
                onChange={handleChange}
                required
                className="w-full"
              />
            </div>
          </div>

          {personType === "juridica" && (
            <div className={`flex ${
              deviceType === "mobile" ? "flex-col space-y-4" : 
              "flex-row space-y-0 space-x-4"
            } w-full`}>
              <div className="w-full md:w-1/2">
                <Label htmlFor="fantasia" className={`${
                  deviceType === "mobile" ? "text-sm" : "text-base"
                } text-gray-700`}>
                  Nome Fantasia <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="fantasia"
                  name="fantasia"
                  type="text"
                  value={formData.fantasia}
                  onChange={handleChange}
                  placeholder="Digite o Nome Fantasia"
                  required
                  className="w-full"
                />
              </div>
              <div className="w-full md:w-1/2 relative">
                <Label htmlFor="regime" className={`${
                  deviceType === "mobile" ? "text-sm" : "text-base"
                } text-gray-700`}>
                  Regime Tributário <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="regime"
                  name="regime"
                  type="text"
                  value={formData.regime}
                  onChange={handleChange}
                  onBlur={() => setTimeout(() => setShowRegimeOptions(false), 200)}
                  onFocus={() => setShowRegimeOptions(true)}
                  placeholder="Digite o Regime Tributário"
                  required
                  className={`w-full ${errors.regime ? "border-red-500" : ""}`}
                />
                {errors.regime && (
                  <p className="mt-1 text-sm text-red-600">{errors.regime}</p>
                )}
                {showRegimeOptions && (
                  <ul className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                    {filteredRegimes.map((regime, index) => (
                      <li
                        key={index}
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() => selecionarRegime(regime)}
                      >
                        {regime}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          )}

          <div className="w-full">
            <Label htmlFor="senha" className={`${
              deviceType === "mobile" ? "text-sm" : "text-base"
            } text-gray-700`}>
              Senha <span className="text-red-500">*</span>
            </Label>
            <div className="relative w-full">
              <Input
                id="senha"
                name="senha"
                type={showPassword ? "text" : "password"}
                value={formData.senha}
                onChange={handleChange}
                placeholder="Digite sua senha"
                required
                minLength={6}
                className="w-full pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700">
                {showPassword ? (
                  <IoEyeOffSharp size={20} />
                ) : (
                  <IoEyeSharp size={20} />
                )}
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }, [currentPage, deviceType, formData, handleChange, handleBlur, personType, showPassword, termsAccepted, errors, showRegimeOptions, filteredRegimes, selecionarRegime]);

  const renderNavigationButtons = useMemo(() => {
    return (
      <div className={`flex justify-between w-full ${
        deviceType === "mobile" ? "mt-4" : "mt-6"
      }`}>
        {currentPage > 1 && (
          <Button
            type="button"
            onClick={prevPage}
            className="flex items-center gap-2 bg-gradient-to-r from-[#09bc8a] to-[#0c1b33] text-white hover:opacity-90">
            <FaArrowLeft /> Voltar
          </Button>
        )}

        {currentPage < totalPages ? (
          <Button
            type="button"
            onClick={nextPage}
            disabled={!validateCurrentPage}
            className={`flex items-center gap-2 ml-auto bg-gradient-to-r from-[#09bc8a] to-[#0c1b33] text-white hover:opacity-90 ${
              !validateCurrentPage ? "opacity-70 cursor-not-allowed" : ""
            }`}>
            Próximo <FaArrowRight />
          </Button>
        ) : (
          <Button
            type="submit"
            className="flex items-center gap-2 ml-auto bg-gradient-to-r from-[#09bc8a] to-[#0c1b33] text-white hover:opacity-90"
            disabled={isLoading || !termsAccepted}>
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
    );
  }, [currentPage, deviceType, isLoading, nextPage, prevPage, termsAccepted, totalPages, validateCurrentPage]);

  return (
    <div className={`w-full ${
      deviceType === "mobile" ? "max-w-[95vw]" : 
      deviceType === "tablet" ? "max-w-[90vw]" : 
      deviceType === "laptop" ? "max-w-[85vw]" : 
      "max-w-[800px]"
    } relative rounded-lg mx-auto`}>
      <div className={`relative bg-white rounded-lg ${
        deviceType === "mobile" ? "p-4" : "p-6"
      } z-10 border border-gray-200 w-full`}>
        <h2 className={`${
          deviceType === "mobile" ? "text-xl" : "text-2xl"
        } font-bold text-center mb-2`}>Criar Conta</h2>

        <form onSubmit={handleSubmit} className="space-y-4 w-full">
          {renderFormFields}
          {renderNavigationButtons}
        </form>

        {currentPage === 1 && (
          <p className={`mt-3 text-center ${
            deviceType === "mobile" ? "text-sm" : "text-base"
          } font-medium text-black w-full`}>
            Já tem uma conta?{" "}
            <Link
              href="/login"
              className="text-[#09bc8a] hover:underline hover:text-[#000000] underline decoration-solid"
              scroll={false}>
              Faça login
            </Link>
          </p>
        )}
      </div>
    </div>
  );
};

export default function RegisterPage() {
  const pathname = usePathname();
  const deviceType = useDeviceType();

  const shouldShowSplitLayout = useMemo(() => 
    deviceType === "laptop" || deviceType === "desktop", 
    [deviceType]
  );

  const animationDuration = useMemo(() => {
    switch (deviceType) {
      case "mobile": return 0;
      case "tablet": return 0.3;
      default: return 0.7;
    }
  }, [deviceType]);

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

      <div className={`grid min-h-screen ${
        shouldShowSplitLayout ? "lg:grid-cols-[1fr_1.2fr]" : ""
      }`}>
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
                className="absolute inset-0">
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

        <div className={`flex flex-col gap-6 p-4 w-full max-w-[95vw] mx-auto my-4 ${
          shouldShowSplitLayout ? "lg:max-w-2xl lg:p-8" : ""
        } order-last`}>
          <AnimatePresence mode="wait">
            <motion.div
              key={pathname}
              initial={{
                x: deviceType === "mobile" ? 0 : (pathname === "/login" ? "100%" : "-100%"),
                opacity: deviceType === "mobile" ? 1 : 0,
              }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ 
                x: deviceType === "mobile" ? 0 : (pathname === "/login" ? "-100%" : "100%"), 
                opacity: deviceType === "mobile" ? 1 : 0 
              }}
              transition={{ duration: animationDuration, ease: "easeInOut" }}
              className="flex flex-1 items-center justify-center p-2 w-full">
              <RegisterForm deviceType={deviceType} />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <div className={`fixed ${
        deviceType === "mobile" ? "top-2" : "top-4"
      } right-0 z-50 max-w-[calc(100%-32px)] flex`}>
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
  );
}
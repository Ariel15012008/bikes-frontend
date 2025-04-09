"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { IoEyeSharp, IoEyeOffSharp } from "react-icons/io5";
import { FaArrowDown } from "react-icons/fa";
import Image from "next/image";
import { toast, Toaster } from "sonner";
import { useRouter } from "next/navigation";
import { authFetch } from "../utils/authFetch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

interface País {
  id: number;
  nome: string;
  codigo_iso: string;
}

interface Estado {
  id: number;
  nome: string;
  sigla: string;
  id_pais: number;
}

interface Cidade {
  id: number;
  nome: string;
  codigo_ibge: number;
  id_estado: number;
}

interface Endereco {
  id_pais: string;
  id_estado: string;
  id_cidade: string;
  cep: string;
  logradouro: string;
  numero: string;
  complemento?: string;
  bairro: string;
  endereco_primario: boolean;
}

interface SavedEndereco {
  id: number;
  cep: string;
  logradouro: string;
  numero: string;
  complemento?: string;
  bairro: string;
  nome_cidade: string;
  nome_estado: string;
  endereco_primario: boolean;
}

export default function ProfilePage() {
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    telefone: "",
    senha: "",
  });

  const [enderecos, setEnderecos] = useState<SavedEndereco[]>([]);
  const [currentEndereco, setCurrentEndereco] = useState<Endereco>({
    id_pais: "",
    id_estado: "",
    id_cidade: "",
    cep: "",
    logradouro: "",
    numero: "",
    complemento: "",
    bairro: "",
    endereco_primario: false,
  });

  const [countries, setCountries] = useState<País[]>([]);
  const [states, setStates] = useState<Estado[]>([]);
  const [cities, setCities] = useState<Cidade[]>([]);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [showLocationForm, setShowLocationForm] = useState(false);
  const [isSavingLocation, setIsSavingLocation] = useState(false);
  const [showArrow, setShowArrow] = useState(false);
  const router = useRouter();

  const scrollToLocations = () => {
    const element = document.getElementById("saved-locations");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const formatPhone = (value: string): string => {
    const numbers = value.replace(/\D/g, "");
    if (numbers.length === 11) {
      return numbers.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
    }
    return value;
  };

  const formatCEP = (value: string): string => {
    const numbers = value.replace(/\D/g, "");
    if (numbers.length <= 5) {
      return numbers;
    }
    if (numbers.length <= 8) {
      return `${numbers.slice(0, 5)}-${numbers.slice(5)}`;
    }
    return `${numbers.slice(0, 5)}-${numbers.slice(5, 8)}`;
  };

  const handleNumericInput = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: keyof Endereco
  ) => {
    const value = e.target.value.replace(/\D/g, "");
    setCurrentEndereco((prev) => ({ ...prev, [field]: value }));
  };

  const handleCEPChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatCEP(e.target.value);
    setCurrentEndereco((prev) => ({ ...prev, cep: formattedValue }));
  };

  useEffect(() => {
    authFetch("http://localhost:8000/auth/refresh-token", {
      method: "POST",
    }).catch(() => {
      toast.error("Erro de sessão", {
        description: "Não foi possível renovar sua sessão automaticamente",
      });
    });
  }, []);

  useEffect(() => {
    authFetch("http://localhost:8000/localidades/paises")
      .then((response) => response.json())
      .then((data) => setCountries(data))
      .catch(() =>
        toast.error("Erro ao carregar", {
          description: "Não foi possível carregar a lista de países",
        })
      );
  }, []);

  useEffect(() => {
    if (currentEndereco.id_pais) {
      authFetch(
        `http://localhost:8000/localidades/estados?pais_id=${currentEndereco.id_pais}`
      )
        .then((response) => response.json())
        .then((data) => setStates(data))
        .catch(() =>
          toast.error("Erro ao carregar", {
            description: "Não foi possível carregar a lista de estados",
          })
        );
    }
  }, [currentEndereco.id_pais]);

  useEffect(() => {
    if (currentEndereco.id_estado) {
      authFetch(
        `http://localhost:8000/localidades/cidades?estado_id=${currentEndereco.id_estado}`
      )
        .then((response) => response.json())
        .then((data) => setCities(data))
        .catch(() =>
          toast.error("Erro ao carregar", {
            description: "Não foi possível carregar a lista de cidades",
          })
        );
    }
  }, [currentEndereco.id_estado]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userResponse = await authFetch("http://localhost:8000/users/me");
        const userData = await userResponse.json();

        setFormData({
          nome: userData.nome || "",
          email: userData.email || "",
          telefone: userData.telefone ? formatPhone(userData.telefone) : "",
          senha: "",
        });

        const enderecosResponse = await authFetch(
          "http://localhost:8000/users/enderecos"
        );
        const enderecosData = await enderecosResponse.json();
        setEnderecos(enderecosData.enderecos || []);
      } catch (error) {
        toast.error("Erro ao carregar", {
          description: "Não foi possível carregar seus dados de perfil",
        });
        router.push("/login");
      } finally {
        setIsFetching(false);
      }
    };

    fetchData();
  }, [router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const formatted = name === "telefone" ? formatPhone(value) : value;
    setFormData((prev) => ({ ...prev, [name]: formatted }));
  };

  const handleEnderecoChange = (
    key: keyof Endereco,
    value: string | boolean
  ) => {
    setCurrentEndereco((prev) => ({ ...prev, [key]: value }));
  };

  const saveEndereco = async (enderecoData: Endereco) => {
    try {
      setIsSavingLocation(true);

      const estadoSelecionado = states.find(
        (e) => e.id.toString() === enderecoData.id_estado
      );
      const cidadeSelecionada = cities.find(
        (c) => c.id.toString() === enderecoData.id_cidade
      );

      if (!estadoSelecionado || !cidadeSelecionada) {
        toast.error("Dados incompletos", {
          description: "Selecione um estado e cidade válidos",
        });
        return null;
      }

      const requestBody = {
        cep: enderecoData.cep.replace(/\D/g, ""),
        logradouro: enderecoData.logradouro,
        numero: enderecoData.numero,
        complemento: enderecoData.complemento || "",
        bairro: enderecoData.bairro,
        nome_cidade: cidadeSelecionada.nome,
        nome_estado: estadoSelecionado.nome,
        endereco_primario: enderecoData.endereco_primario,
      };

      const response = await authFetch(
        "http://localhost:8000/users/create-endereco",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Erro ao salvar localização");
      }

      const result = await response.json();

      toast.success("Localização salva!", {
        description: "Seu endereço foi cadastrado com sucesso",
      });

      setShowArrow(!!enderecoData.complemento);

      // Atualiza a lista de endereços após cadastrar um novo
      const enderecosResponse = await authFetch(
        "http://localhost:8000/users/enderecos"
      );
      const enderecosData = await enderecosResponse.json();
      setEnderecos(enderecosData.enderecos || []);

      return result;
    } catch (error: any) {
      toast.error("Falha ao salvar", {
        description:
          error.message || "Ocorreu um erro ao tentar salvar a localização",
      });
      return null;
    } finally {
      setIsSavingLocation(false);
    }
  };

  const addEndereco = async () => {
    if (
      !currentEndereco.id_pais ||
      !currentEndereco.id_estado ||
      !currentEndereco.id_cidade
    ) {
      toast.error("Dados obrigatórios", {
        description: "Preencha país, estado e cidade",
      });
      return;
    }

    const result = await saveEndereco(currentEndereco);

    if (result) {
      setCurrentEndereco({
        id_pais: "",
        id_estado: "",
        id_cidade: "",
        cep: "",
        logradouro: "",
        numero: "",
        complemento: "",
        bairro: "",
        endereco_primario: false,
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await authFetch("http://localhost:8000/users/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          pessoa: {
            nome_completo: formData.nome,
            email: formData.email,
            telefone_celular: formData.telefone.replace(/\D/g, ""),
          },
          usuario: {
            email: formData.email,
            senha: formData.senha || undefined,
          },
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Erro ao atualizar perfil");
      }

      toast.success("Perfil atualizado!", {
        description: "Seus dados foram salvos com sucesso",
      });

      setFormData((prev) => ({ ...prev, senha: "" }));
    } catch (error: any) {
      toast.error("Falha na atualização", {
        description:
          error.message || "Ocorreu um erro ao tentar atualizar seu perfil",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const setAsPrimaryAddress = async (id: number) => {
    try {
      const response = await authFetch(
        `http://localhost:8000/users/enderecos/${id}/set-primary`,
        {
          method: "PUT",
        }
      );

      if (!response.ok) {
        throw new Error("Falha ao definir endereço como primário");
      }

      // Atualiza a lista de endereços após a mudança
      const enderecosResponse = await authFetch(
        "http://localhost:8000/users/enderecos"
      );
      const enderecosData = await enderecosResponse.json();
      setEnderecos(enderecosData.enderecos || []);

      toast.success("Endereço principal atualizado!");
    } catch (error) {
      toast.error("Erro", {
        description: "Não foi possível definir este endereço como principal",
      });
    }
  };

  if (isFetching) {
    return (
      <main className="mt-[80px] min-h-screen flex items-center justify-center bg-gray-100">
        <div className="w-8 h-8 border-4 border-[#09bc8a] border-t-transparent rounded-full animate-spin"></div>
      </main>
    );
  }

  return (
    <div className="font-sans">
      <Header />
      <main className="mt-[80px] min-h-screen px-4 py-10 bg-gray-100">
        <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-6">
          <div className="flex flex-col items-center justify-center gap-4 mb-8 md:mb-10">
            <div className="w-24 h-24 md:w-32 md:h-32 relative rounded-full overflow-hidden shadow-md">
              <Image
                src="/img/perfil-placeholder.png"
                alt="Foto de perfil"
                fill
                className="object-cover"
              />
            </div>
            <p className="text-lg md:text-xl font-semibold">{formData.nome}</p>
            <Button variant="outline" className="text-sm md:text-base">
              Trocar foto
            </Button>
          </div>

          {!showLocationForm ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label>Nome completo</Label>
                <Input
                  name="nome"
                  value={formData.nome}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <Label>Email</Label>
                <Input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <Label>Telefone</Label>
                <Input
                  name="telefone"
                  value={formData.telefone}
                  onChange={handleChange}
                  maxLength={15}
                  required
                />
              </div>
              <div>
                <Label>Nova Senha</Label>
                <div className="relative">
                  <Input
                    name="senha"
                    type={showPassword ? "text" : "password"}
                    value={formData.senha}
                    onChange={handleChange}
                    className="pr-10"
                    placeholder="Deixe em branco para manter"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
                    {showPassword ? <IoEyeOffSharp /> : <IoEyeSharp />}
                  </button>
                </div>
              </div>

              <Button
                type="button"
                onClick={() => setShowLocationForm(true)}
                className="w-full">
                Adicionar informação de localização
              </Button>

              <Button
                type="submit"
                disabled={isLoading}
                className="h-12 w-full bg-gradient-to-r from-[#09bc8a] to-[#0c1b33] text-white">
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  "Salvar Alterações"
                )}
              </Button>
            </form>
          ) : (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label>País</Label>
                  <Select
                    value={currentEndereco.id_pais}
                    onValueChange={(v) => handleEnderecoChange("id_pais", v)}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="País" />
                    </SelectTrigger>
                    <SelectContent>
                      {countries.map((p) => (
                        <SelectItem key={p.id} value={p.id.toString()}>
                          {p.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Estado</Label>
                  <Select
                    value={currentEndereco.id_estado}
                    onValueChange={(v) => handleEnderecoChange("id_estado", v)}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Estado" />
                    </SelectTrigger>
                    <SelectContent>
                      {states.map((e) => (
                        <SelectItem key={e.id} value={e.id.toString()}>
                          {e.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Cidade</Label>
                  <Select
                    value={currentEndereco.id_cidade}
                    onValueChange={(v) => handleEnderecoChange("id_cidade", v)}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Cidade" />
                    </SelectTrigger>
                    <SelectContent>
                      {cities.map((c) => (
                        <SelectItem key={c.id} value={c.id.toString()}>
                          {c.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label>CEP</Label>
                  <Input
                    value={currentEndereco.cep}
                    onChange={handleCEPChange}
                    placeholder="00000-000"
                    maxLength={9}
                  />
                </div>
                <div>
                  <Label>Bairro</Label>
                  <Input
                    value={currentEndereco.bairro}
                    onChange={(e) =>
                      handleEnderecoChange("bairro", e.target.value)
                    }
                    placeholder="Bairro"
                  />
                </div>
                <div>
                  <Label>Logradouro</Label>
                  <Input
                    value={currentEndereco.logradouro}
                    onChange={(e) =>
                      handleEnderecoChange("logradouro", e.target.value)
                    }
                    placeholder="Logradouro"
                  />
                </div>
                <div>
                  <Label>Número</Label>
                  <Input
                    value={currentEndereco.numero}
                    onChange={(e) => handleNumericInput(e, "numero")}
                    placeholder="Número"
                  />
                </div>
                <div className="relative pb-10">
                  <Label>Complemento</Label>
                  <Input
                    value={currentEndereco.complemento || ""}
                    onChange={(e) =>
                      handleEnderecoChange("complemento", e.target.value)
                    }
                    placeholder="Complemento (opcional)"
                    className={`mt-1 ${showArrow ? "mb-6" : ""}`}
                  />
                  {showArrow && (
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 sm:left-[100%] sm:translate-x-0">
                      <button
                        onClick={scrollToLocations}
                        className="animate-bounce cursor-pointer">
                        <FaArrowDown className="text-[#0f9972] text-3xl" />
                      </button>
                    </div>
                  )}
                </div>
                <div className="flex items-center space-x-2 pb-12 pl-3">
                  <Checkbox
                    id="endereco-primario"
                    checked={currentEndereco.endereco_primario}
                    onCheckedChange={(checked) =>
                      handleEnderecoChange(
                        "endereco_primario",
                        checked as boolean
                      )
                    }
                  />
                  <label
                    htmlFor="endereco-primario"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Definir como endereço principal
                  </label>
                </div>
              </div>

              <div className="flex flex-col gap-4 mt-6">
                <Button
                  onClick={addEndereco}
                  className="w-full"
                  disabled={isSavingLocation}>
                  {isSavingLocation ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    "Adicionar localização"
                  )}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setCurrentEndereco({
                      id_pais: "",
                      id_estado: "",
                      id_cidade: "",
                      cep: "",
                      logradouro: "",
                      numero: "",
                      complemento: "",
                      bairro: "",
                      endereco_primario: false,
                    });
                    setShowLocationForm(false);
                    setShowArrow(false);
                  }}
                  className="w-full">
                  Voltar
                </Button>
              </div>

              {enderecos.length > 0 && (
                <div id="saved-locations" className="pt-8 space-y-4">
                  <h3 className="text-lg font-semibold">
                    Endereços cadastrados
                  </h3>
                  {enderecos.map((e, i) => (
                    <div
                      key={e.id}
                      className={`p-4 border rounded-md space-y-1 text-sm ${
                        e.endereco_primario
                          ? "border-[#09bc8a] bg-[#09bc8a]/10"
                          : "border-gray-200 bg-gray-50"
                      }`}>
                      <div className="flex justify-between items-start">
                        <p className="font-semibold">
                          📍 {i + 1} -{" "}
                          {e.endereco_primario
                            ? "Endereço principal"
                            : "Endereço secundário"}
                        </p>
                        {!e.endereco_primario && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setAsPrimaryAddress(e.id)}
                            className="text-xs h-7">
                            Tornar principal
                          </Button>
                        )}
                      </div>
                      <p>
                        <strong>Estado:</strong> {e.nome_estado}
                      </p>
                      <p>
                        <strong>Cidade:</strong> {e.nome_cidade}
                      </p>
                      <p>
                        <strong>Logradouro:</strong> {e.logradouro}
                      </p>
                      <p>
                        <strong>Número:</strong> {e.numero}
                      </p>
                      {e.complemento && (
                        <p className="text-[#0f9972] font-medium">
                          <strong>Complemento:</strong> {e.complemento}
                        </p>
                      )}
                      <p>
                        <strong>Bairro:</strong> {e.bairro}
                      </p>
                      <p>
                        <strong>CEP:</strong> {e.cep}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </main>
      <Footer />

      <Toaster
        position="bottom-right"
        toastOptions={{
          unstyled: true,
          classNames: {
            title: "font-bold text-sm",
            description: "text-sm",
            toast:
              "flex items-center p-4 rounded-md shadow-lg gap-4 max-w-[320px]",
            error: "bg-red-400 text-white",
            success: "bg-green-400 text-white",
          },
        }}
      />
    </div>
  );
}

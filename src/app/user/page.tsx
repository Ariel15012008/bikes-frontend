'use client';

import { useState } from 'react';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { IoEyeSharp, IoEyeOffSharp } from 'react-icons/io5';
import Image from 'next/image';
import api from '@/app/utils/axiosInstance';
import { toast } from 'sonner';

export default function ProfilePage() {
  const [formData, setFormData] = useState({
    nome: 'João Silva',
    email: 'user@example.com',
    telefone: '(11) 91234-5678',
    senha: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const formatPhone = (value: string): string => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length === 11) {
      return numbers.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    }
    return value;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let formattedValue = value;

    if (name === 'telefone') {
      formattedValue = formatPhone(value);
    }

    setFormData((prev) => ({ ...prev, [name]: formattedValue }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const payload = {
        pessoa: {
          nome_completo: formData.nome,
          email: formData.email,
          telefone_celular: formData.telefone.replace(/\D/g, ''),
        },
        usuario: {
          email: formData.email,
          senha: formData.senha || undefined, // só envia se estiver preenchida
        },
      };

      const response = await api.put('/users/update', payload);

      if (response.status === 200) {
        toast.success('Perfil atualizado com sucesso!');
        setFormData((prev) => ({ ...prev, senha: '' }));
      }
    } catch (error: any) {
      console.error('Erro ao atualizar perfil:', error);
      const errorMsg =
        error.response?.data?.message ||
        error.response?.data?.detail ||
        'Erro ao atualizar perfil.';
      toast.error('Erro ao atualizar', {
        description: errorMsg,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="font-sans">
      <Header />

      <main className="mt-[80px] min-h-screen px-4 py-10 bg-gray-100">
        <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-8">
          {/* Perfil do usuário */}
          <div className="flex flex-col items-center justify-center gap-4 mb-10">
            <div className="w-32 h-32 relative rounded-full overflow-hidden shadow-md">
              <Image
                src="/img/perfil-placeholder.png"
                alt="Foto de perfil"
                fill
                className="object-cover"
              />
            </div>
            <p className="text-xl font-semibold">{formData.nome}</p>
            <Button variant="outline">Trocar foto</Button>
          </div>

          {/* Formulário de edição */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="nome">Nome</Label>
              <Input
                id="nome"
                name="nome"
                type="text"
                value={formData.nome}
                onChange={handleChange}
                placeholder="Digite seu nome"
                required
              />
            </div>

            <div>
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Digite seu e-mail"
                required
              />
            </div>

            <div>
              <Label htmlFor="telefone">Telefone</Label>
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

            <div>
              <Label htmlFor="senha">Nova Senha</Label>
              <div className="relative">
                <Input
                  id="senha"
                  name="senha"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.senha}
                  onChange={handleChange}
                  placeholder="Digite uma nova senha"
                  minLength={6}
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <IoEyeOffSharp /> : <IoEyeSharp />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="bg-gradient-to-r from-[#09bc8a] to-[#0c1b33] text-white w-full"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                'Salvar Alterações'
              )}
            </Button>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}

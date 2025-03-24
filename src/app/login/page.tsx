import { LoginForm } from "@/components/ui/login-form";
import { Toaster } from "@/components/ui/sonner";

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
      <div className="fixed top-4 right-4 z-50 max-w-[calc(100%-32px)]">
        {" "}
        {/* Limita a largura máxima */}
        <Toaster
          toastOptions={{
            unstyled: true,
            classNames: {
              title: "font-bold text-sm max-[600px]:text-xs",
              description: "text-sm max-[600px]:text-xs",
              toast:
                "flex justify-items-end alingn-itens-end p-4 rounded-md shadow-lg gap-4 max-[600px]:max-w-[300px]", // Define um tamanho máximo
              error: "bg-red-400 text-white",
              success: "bg-green-400 text-white",
              warning: "bg-yellow-400 text-black",
              info: "bg-blue-400 text-white",
            },
          }}
        />
      </div>
    </div>
  );
}

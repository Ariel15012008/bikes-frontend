import { LoginForm } from "@/components/ui/login-form";
import { Toaster } from "@/components/ui/sonner";

export default function LoginPage() {
  return (
    <>
      {/* Imagem de fundo APENAS para telas <1025px */}
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
        {/* Coluna Esquerda (Formulário) */}
        <div className="flex flex-col gap-6 p-8 md:p-10 max-[1024px]:bg-white max-[1024px]:rounded-xl max-[1024px]:shadow-xl max-[1024px]:mx-auto max-[1024px]:my-25 max-[1024px]:max-w-md">
          <div className="flex flex-1 items-center justify-center">
            <div>
              <LoginForm />
            </div>
          </div>
        </div>

        {/* Coluna Direita (Imagem - apenas >=1025px) */}
        <div className="relative hidden lg:block">
          <img
            src="/img/fundo-cadastro.jpg"
            alt="Imagem de fundo"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-[#09bc8a]/50"></div>
        </div>
      </div>

      {/* Toaster ajustado */}
      <div className="fixed top-4 right-4 z-50">
        <Toaster
          toastOptions={{
            unstyled: true,
            classNames: {
              title: "font-bold text-sm max-[600px]:text-xs",
              description: "text-sm max-[600px]:text-xs",
              toast: "ml-auto max-sm:mr-8 flex items-center p-4 rounded-md shadow-lg gap-4 max-w-[320px] max-sm:max-w-[290px] ",
              error: "bg-red-400 text-white",
              success: "bg-green-400 text-white",
              warning: "bg-yellow-400 text-black",
              info: "bg-blue-400 text-white",
            },
          }}
        />
    </div>
    </>
  );
}
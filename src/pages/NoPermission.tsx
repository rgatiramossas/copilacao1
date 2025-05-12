
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ShieldAlert } from "lucide-react";

const NoPermission = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <div className="text-center max-w-md">
        <ShieldAlert className="h-16 w-16 text-red-500 mx-auto mb-4" />
        <h1 className="text-2xl font-bold mb-4">Acesso Negado</h1>
        <p className="text-gray-600 mb-8">
          Você não tem permissão para acessar esta página. Se acha que isso é um erro,
          entre em contato com o administrador do sistema.
        </p>
        <Button asChild className="bg-blue-deep hover:bg-blue-700">
          <Link to="/dashboard">Voltar ao Dashboard</Link>
        </Button>
      </div>
    </div>
  );
};

export default NoPermission;

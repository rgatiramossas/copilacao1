
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: Usuário tentou acessar rota inexistente:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <div className="text-center max-w-md">
        <h1 className="text-6xl font-bold text-blue-deep mb-4">404</h1>
        <p className="text-xl text-gray-700 mb-6">Ops! Página não encontrada</p>
        <p className="text-gray-600 mb-8">
          A página que você está procurando pode ter sido removida, renomeada ou
          está temporariamente indisponível.
        </p>
        <Button asChild className="bg-blue-deep hover:bg-blue-700">
          <Link to="/dashboard">Voltar ao Dashboard</Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;

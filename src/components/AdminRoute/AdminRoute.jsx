import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";

import { auth } from "../../lib/firebase";

function AdminRoute({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUsuario(user);
      setCarregando(false);
    });

    return () => unsubscribe();
  }, []);

  if (carregando) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#080708",
          color: "#c9a45c",
          fontFamily: "Arial, sans-serif",
          fontSize: "11px",
          letterSpacing: "2px",
        }}
      >
        VERIFICANDO ACESSO...
      </div>
    );
  }

  if (!usuario) {
    return <Navigate to="/admin" replace />;
  }

  const adminEmail = import.meta.env.VITE_ADMIN_EMAIL;

  if (
    !adminEmail ||
    usuario.email?.toLowerCase() !== adminEmail.toLowerCase()
  ) {
    return <Navigate to="/admin" replace />;
  }

  return children;
}

export default AdminRoute;
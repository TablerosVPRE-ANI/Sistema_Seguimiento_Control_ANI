import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* otras opciones de configuración podrían ir aquí */

  // Esta es la configuración clave que necesitamos:
  eslint: {
    // Le dice a Vercel que ignore los errores de ESLint durante la construcción.
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
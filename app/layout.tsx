// FIX: Convert to a client component to use state and hooks for the sidebar.
"use client";

import React, { useState } from "react";
import { Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
// FIX: Import hooks for navigation and type for view state.
import { usePathname, useRouter } from "next/navigation";
import { View } from "@/lib/types";

const inter = Inter({ subsets: ["latin"] });

// Note: The 'metadata' export is not supported in client components and has been removed to fix the build error.
// You can move this to a parent layout or page if it's a server component.

// FIX: Create mappings between view names and URL paths for navigation.
// FIX: Removed routes for module-specific Estatus pages that are not defined in the `View` type to fix the error.
const viewToPath: Record<View, string> = {
  Kanban: "/kanban",
  Pedidos: "/pedidos",
  Precios: "/precios",
  Clientes: "/clientes",
  Logística: "/logistica",
  Personal: "/personal",
  "Configuración-Estatus": "/configuracion/estatus",
  "Configuración-Turnos": "/configuracion/turnos",
  "Configuración-Sucursal": "/configuracion/sucursal",
  "Configuración-Formas de Pago": "/configuracion/formas-de-pago",
  "Configuración-Reparto": "/configuracion/reparto",
  "Configuración-Zonas": "/configuracion/zonas",
  "Configuración-Clientes": "/configuracion/clientes",
  "Configuración-Productos": "/configuracion/productos",
  "Configuración-Perfil": "/configuracion/perfil",
};

const pathToView = Object.fromEntries(
  Object.entries(viewToPath).map(([k, v]) => [v, k])
);

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);
  // FIX: Get router and pathname to control sidebar state and navigation.
  const router = useRouter();
  const pathname = usePathname();

  const toggleSidebar = () => {
    setSidebarCollapsed((prev) => !prev);
  };

  // FIX: Determine active view from the current path, defaulting to 'Pedidos'.
  const activeView = (pathToView[pathname] as View) || "Pedidos";

  // FIX: Handle navigation when a sidebar item is clicked.
  const setActiveView = (view: View) => {
    const path = viewToPath[view];
    if (path) {
      router.push(path);
    }
  };

  return (
    <html lang="es">
      <body className={`${inter.className} bg-gray-50`}>
        <div className="flex h-screen font-sans">
          <Sidebar
            isCollapsed={isSidebarCollapsed}
            toggleSidebar={toggleSidebar}
            // FIX: Pass activeView and setActiveView props to Sidebar to resolve the error.
            activeView={activeView}
            setActiveView={setActiveView}
          />
          <main className="flex-1 flex flex-col overflow-hidden">
            <div className="flex-1 overflow-x-hidden overflow-y-auto">
              <div className="container mx-auto px-6 py-8">{children}</div>
            </div>
          </main>
        </div>
      </body>
    </html>
  );
}

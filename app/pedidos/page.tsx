// FIX: Convert to a client component to use state.
"use client";
import React, { useState } from 'react';
import PedidosTable from '@/components/PedidosTable';
// FIX: Import types and initial data needed for state.
import { initialPedidos } from '@/lib/data';
import { Pedido } from '@/lib/types';

export default function PedidosPage() {
  // FIX: Add state for pedidos and pass it to the table.
  const [pedidos, setPedidos] = useState<Pedido[]>(initialPedidos);
  // FIX: Add state for isSelectOpen and pass it to the table to fix missing prop error.
  const [isSelectOpen, setIsSelectOpen] = useState(false);

  return <PedidosTable pedidos={pedidos} setPedidos={setPedidos} setIsSelectOpen={setIsSelectOpen} />;
}

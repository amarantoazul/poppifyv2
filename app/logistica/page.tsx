// FIX: Convert to a client component to use state.
"use client";
import React, { useState } from 'react';
import LogisticaTable from '@/components/LogisticaTable';

export default function LogisticaPage() {
  // FIX: Add state for isSelectOpen and pass it to the table to fix missing prop error.
  const [isSelectOpen, setIsSelectOpen] = useState(false);
  return <LogisticaTable setIsSelectOpen={setIsSelectOpen} />;
}

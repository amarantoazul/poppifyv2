// FIX: Convert to a client component to use state.
"use client";
import React, { useState } from 'react';
import PersonalTable from '@/components/PersonalTable';
// FIX: Import types and initial data needed for state.
// FIX: Correct import to use `initialEstatusConfig` as `initialEstatusPersonalConfig` does not exist.
import { initialPersonal, initialEstatusConfig } from '@/lib/data';
// FIX: Correct import to use `EstatusConfig` as `EstatusPersonalConfig` does not exist.
import { Personal, EstatusConfig } from '@/lib/types';

export default function PersonalPage() {
  // FIX: Add state for personal and estatusPersonalConfig to provide the required props to the table.
  const [personal, setPersonal] = useState<Personal[]>(initialPersonal);
  // FIX: Correct state to use `EstatusConfig` type and `initialEstatusConfig` data.
  const [estatusConfig, setEstatusConfig] = useState<EstatusConfig[]>(initialEstatusConfig);
  // FIX: Add state for isSelectOpen and pass it to the table to fix missing prop error.
  const [isSelectOpen, setIsSelectOpen] = useState(false);

  // FIX: Pass all required props to PersonalTable to fix missing properties error.
  // FIX: Correct prop name from `estatusPersonalConfig` to `estatusConfig`.
  return <PersonalTable personal={personal} setPersonal={setPersonal} estatusConfig={estatusConfig} setIsSelectOpen={setIsSelectOpen} />;
}

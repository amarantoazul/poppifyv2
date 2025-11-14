// FIX: Convert to a client component to use state.
"use client";
import React, { useState } from 'react';
import PersonalTable from '@/components/PersonalTable';

export default function PersonalPage() {
  // FIX: Add state for isSelectOpen and pass it to the table to fix missing prop error.
  const [isSelectOpen, setIsSelectOpen] = useState(false);
  return <PersonalTable setIsSelectOpen={setIsSelectOpen} />;
}

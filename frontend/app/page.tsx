"use client";

import { useState } from "react";
import CVForm from "./components/CVForm";
import { CVData } from "./lib/types";

export default function Home() {
  const [cvData, setCvData] = useState<CVData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        <CVForm />
      </main>
    </div>
  );
}

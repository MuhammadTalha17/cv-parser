"use client";

import { useState, useRef } from "react";
import CVForm from "./components/CVForm";
import { CVData } from "./lib/types";
import axios from "axios";

export default function Home() {
  const [cvData, setCvData] = useState<CVData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setError(null);
    setCvData(null);

    const formData = new FormData(); //browser API for sending file uploads
    formData.append("file", file);

    try {
      const response = await axios.post(
        "http://localhost:8000/api/parse-cv",
        formData,
      );

      const data = {
        ...response.data.data,
        skills: response.data.data.skills.map((s: string) => ({ name: s })),
      };

      setCvData(data);
    } catch (error: any) {
      const message =
        error.response?.data?.detail || error.message || "Failed to parse CV";
      setError(message);
    } finally {
      setLoading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-gray-200 py-6">
        <h1 className="text-center text-2xl font-semibold tracking-tight text-black">
          CV Parser
        </h1>
      </header>
      <main className="max-w-2xl mx-auto px-6 py-12">
        {/* Upload Area */}
        <div className="border-2 border-dashed border-gray-300 rounded-xl p-12 flex flex-col items-center gap-4 text-center mb-6">
          <p className="text-gray-400 text-sm">PDF or DOCX format supported</p>
          <label
            htmlFor="cv-upload"
            className="cursor-pointer bg-black text-white text-sm font-medium px-6 py-3 rounded-lg hover:bg-zinc-800 transition-colors flex items-center gap-2"
          >
            {loading ? (
              <>
                <svg
                  className="animate-spin h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8H4z"
                  />
                </svg>
                Parsing...
              </>
            ) : (
              "Upload CV"
            )}
            <input
              ref={fileInputRef}
              id="cv-upload"
              type="file"
              accept=".pdf,.docx"
              onChange={handleFileUpload}
              disabled={loading}
              className="hidden"
            />
          </label>
        </div>
        {/* Error State */}
        {error && (
          <p className="text-red-500 text-sm text-center mb-6">{error}</p>
        )}
        {/* CV Form */}
        {cvData && <CVForm data={cvData} />}
      </main>
    </div>
  );
}

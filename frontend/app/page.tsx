"use client";

import { useState, useRef } from "react";
import CVForm from "./components/CVForm";
import { CVData } from "./lib/types";
import axios from "axios";
import Sidebar from "./components/Sidebar";

export default function Home() {
  const [cvData, setCvData] = useState<CVData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  //coming from gemini model
  const [rawText, setRawText] = useState<string | null>(null);
  const [saveLoading, setSaveLoading] = useState(false);

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
      setRawText(response.data.raw_text);
    } catch (error: any) {
      const message =
        error.response?.data?.detail || error.message || "Failed to parse CV";
      setError(message);
    } finally {
      setLoading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const openFilePicker = () => {
    if (!loading) fileInputRef.current?.click();
  };

  const handleSaveToDb = async () => {
    if (!cvData || !rawText) return;

    setSaveLoading(true);

    try {
      const response = await axios.post("http://localhost:8000/api/save-cv", {
        ...cvData,
        raw_text: rawText,
      });
      if (response.data) {
        alert("CV saved to database!");
      }
      console.log("response:", response.data);
    } catch (err: any) {
      setError(err.response?.data?.detail || "Failed to save CV");
    } finally {
      setSaveLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#ececec] text-[#141414]">
      <div className="lg:flex">
        <Sidebar />

        <main className="w-full px-5 py-6 lg:px-12 lg:py-10">
          <header className="mb-8 flex items-center justify-between rounded-xl border border-black/10 bg-black px-5 py-4 lg:hidden">
            <p className="text-xl font-black text-white">CVParser</p>
            <button
              type="button"
              onClick={openFilePicker}
              disabled={loading}
              className="rounded-md bg-white px-4 py-2 text-sm font-semibold text-black disabled:opacity-70"
            >
              {loading ? "Parsing..." : "Upload CV"}
            </button>
          </header>

          <section id="home" className="mb-10">
            <h1 className="text-5xl font-black tracking-tight sm:text-7xl">
              CVParser
            </h1>
            <p className="mt-5 max-w-4xl text-3xl font-bold leading-tight sm:text-6xl">
              Extract data from CVs
            </p>
          </section>

          <section
            id="parse-cv"
            className="mb-10 rounded-2xl border border-black/10 bg-white p-6 sm:p-8"
          >
            <p className="mb-4 text-lg font-bold">CV Upload</p>

            <label
              htmlFor="cv-upload"
              className={`block rounded-2xl border-2 border-dashed p-10 text-center transition-colors ${
                loading
                  ? "cursor-not-allowed border-black/30 bg-[#ececec]"
                  : "cursor-pointer border-black/20 bg-[#f4f4f4] hover:border-black/40"
              }`}
            >
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-black/10 bg-white text-xl font-bold">
                {loading ? (
                  <svg
                    className="h-5 w-5 animate-spin"
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
                ) : (
                  "↑"
                )}
              </div>

              <p className="text-3xl font-black tracking-tight">
                {loading ? "Parsing your resume..." : "Drag & drop your resume"}
              </p>
              <p className="mt-2 text-base text-black/60">
                {loading
                  ? "Please wait while we extract data from your CV."
                  : "Or click to browse - PDF and DOCX are supported."}
              </p>

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

            {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
          </section>

          <section
            id="ats-result"
            className="rounded-2xl border border-black/10 bg-white p-6 sm:p-8"
          >
            {/* <div className="mb-1 flex items-center justify-between">
              { <h2 className="text-xl font-black tracking-tight">ATS Result</h2>}
              <span className="rounded-full border border-black/15 px-3 py-1 text-xs font-semibold">
                Structured Data
              </span>
            </div> */}

            {cvData && (
              <button
                onClick={handleSaveToDb}
                disabled={saveLoading}
                className="rounded-md bg-black px-4 py-2 text-xs font-bold text-white transition-opacity hover:opacity-80 disabled:opacity-50"
              >
                {saveLoading ? "Saving..." : "Save to Database"}
              </button>
            )}

            {cvData ? (
              <CVForm data={cvData} />
            ) : (
              <p className="text-sm text-center text-black/60">
                Upload a CV above to see extracted data here.
              </p>
            )}
          </section>
        </main>
      </div>
    </div>
  );
}

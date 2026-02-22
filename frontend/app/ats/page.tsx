"use client";

import { useState } from "react";
import Sidebar from "../components/Sidebar";
import axios from "axios";
import CVForm from "../components/CVForm";
import { CVData } from "../lib/types";
import ScoreCircle from "../components/ScoreCircle";

export default function ATSPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [rawText, setRawText] = useState<string>("");
  const [cvData, setCvData] = useState<CVData | null>(null);
  const [jobDescription, setJobDescription] = useState<string>("");
  const [atsResult, setAtsResult] = useState<{
    score: number;
    match_summary: string;
    tips: string[];
  } | null>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setError(null);
    setAtsResult(null);

    const formData = new FormData(); //browser API for sending file uploads
    formData.append("file", file);

    try {
      const response = await axios.post(
        "http://localhost:8000/api/parse-cv",
        formData,
      );

      const data = {
        ...response.data.data,
        skills: response.data.data.skills.map((skill: string) => ({
          name: skill,
        })),
      };

      setCvData(data);
      setRawText(response.data.raw_text);
    } catch (error: any) {
      setError(error.response?.data?.detail || "Failed to extract text");
    } finally {
      setLoading(false);
    }
  };

  const handleGetAtsScore = async () => {
    if (!rawText || !jobDescription) {
      setError("Please upload a CV and provide a job description.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await axios.post("http://localhost:8000/api/ats-score", {
        raw_text: rawText,
        job_description: jobDescription,
      });
      setAtsResult(response.data.data);
    } catch (error: any) {
      setError(error.response?.data?.detail || "Failed to get ATS score");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#ececec] text-[#141414]">
      <div className="lg:flex">
        <Sidebar />

        <main className="w-full px-5 py-6 lg:px-12 lg:py-10">
          <header className="mb-8 flex items-center justify-between rounded-xl border border-black/10 bg-black px-5 py-4 lg:hidden">
            <p className="text-xl font-black text-white">CVParser</p>
          </header>

          <section className="mb-10">
            <h1 className="text-5xl font-black tracking-tight sm:text-7xl">
              ATS Analysis
            </h1>
            <p className="mt-5 max-w-4xl text-xl font-medium leading-tight sm:text-2xl text-black/60 italic">
              Optimize your resume for any role
            </p>
          </section>

          <div className="space-y-10">
            <div className="grid gap-6 lg:grid-cols-2">
              <div className="rounded-2xl border border-black/10 bg-white p-6 sm:p-8">
                <h2 className="mb-4 text-xl font-black uppercase">
                  1. Upload Resume
                </h2>
                <label
                  className={`block rounded-xl border-2 border-dashed p-8 text-center transition-colors ${
                    loading
                      ? "cursor-not-allowed border-black/30 bg-[#ececec]"
                      : "cursor-pointer border-black/20 bg-[#f4f4f4] hover:border-black/40"
                  }`}
                >
                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl border border-black/10 bg-white font-bold text-xl">
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
                  <p className="font-bold">
                    {rawText ? "Resume Ready ✓" : "Click to upload PDF/DOCX"}
                  </p>
                  <input
                    type="file"
                    className="hidden"
                    onChange={handleFileUpload}
                    disabled={loading}
                    accept=".pdf,.docx"
                  />
                </label>
              </div>

              <div className="rounded-2xl border border-black/10 bg-white p-6 sm:p-8">
                <h2 className="mb-4 text-xl font-black uppercase">
                  2. Job Requirements
                </h2>
                <textarea
                  className="w-full rounded-xl border border-black/10 bg-[#f4f4f4] p-4 text-sm font-medium focus:border-black/30 focus:outline-none"
                  rows={4}
                  placeholder="Paste the job requirements here..."
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                />

                <button
                  onClick={handleGetAtsScore}
                  disabled={loading || !rawText || !jobDescription}
                  className="mt-4 w-full rounded-xl bg-black py-4 font-black italic tracking-widest text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
                >
                  {loading ? "Analyzing..." : "GET ATS SCORE"}
                </button>
                {error && (
                  <p className="mt-4 text-xs text-red-600 font-bold uppercase tracking-widest leading-relaxed">
                    {error}
                  </p>
                )}
              </div>
            </div>

            {/* Results Section */}
            {atsResult ? (
              <div className="grid gap-8 lg:grid-cols-2">
                {/* Left Col: Analysis results */}
                <div className="rounded-2xl border border-black/10 bg-white p-6 sm:p-8">
                  <div className="mb-10 flex flex-col items-center border-b border-black/5 pb-10">
                    <ScoreCircle score={atsResult.score} />
                  </div>
                  <div className="mb-8 rounded-xl border border-black/5 bg-[#f4f4f4] p-6 shadow-sm">
                    <h3 className="mb-2 text-[10px] font-black uppercase tracking-widest text-black/40">
                      Executive Summary
                    </h3>
                    <p className="text-lg font-bold leading-snug italic text-black/80">
                      "{atsResult.match_summary}"
                    </p>
                  </div>

                  <div className="mb-8 rounded-xl border border-black/5 bg-[#f4f4f4] p-6 shadow-sm">
                    <h3 className="mb-2 text-[10px] font-black uppercase tracking-widest text-black/40">
                      Executive Summary
                    </h3>
                    <p className="text-lg font-bold leading-snug italic text-black/80">
                      "{atsResult.match_summary}"
                    </p>
                  </div>

                  <div>
                    <h3 className="mb-4 text-[10px] font-black uppercase tracking-widest text-black/40">
                      Critical Improvements
                    </h3>
                    <ul className="space-y-4">
                      {atsResult.tips.map((tip, i) => (
                        <li
                          key={i}
                          className="flex gap-4 text-sm font-bold bg-[#f4f4f4] p-4 rounded-xl border border-black/5 leading-snug"
                        >
                          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-black text-[10px] text-white">
                            {i + 1}
                          </span>
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/*CV Preview */}
                {/* CV Preview (Structured) */}
                <div className="rounded-2xl border border-black/10 bg-white p-6 sm:p-8">
                  <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-xl font-black uppercase tracking-tight">
                      Parsed Resume
                    </h2>
                  </div>
                  <div className="h-[600px] overflow-y-auto rounded-xl bg-white p-2 border border-black/5 shadow-inner">
                    {cvData ? (
                      <CVForm data={cvData} />
                    ) : (
                      <div className="flex h-full items-center justify-center text-black/20 font-bold italic uppercase tracking-widest">
                        Uploading...
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex h-64 flex-col items-center justify-center rounded-2xl border-2 border-dashed border-black/10 bg-white p-8 text-center text-black/30">
                <p className="text-xl font-black uppercase tracking-tighter italic">
                  Analysis Pending
                </p>
                <p className="text-sm font-bold leading-relaxed px-5 max-w-sm">
                  Upload your resume and provide a job description above to see
                  your results.
                </p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

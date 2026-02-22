"use client";

import { CVData, PersonalInfo } from "../lib/types";
import { useForm, useFieldArray, UseFormRegister } from "react-hook-form";
import { useEffect, useState } from "react";

interface CVFormProps {
  data?: CVData;
}

export default function CVForm({ data }: CVFormProps) {
  const { register, control, reset } = useForm<CVData>({
    defaultValues: data,
  });

  useEffect(() => {
    reset(data);
    console.log("data", data);
  }, [data, reset]);

  const education = useFieldArray({ control, name: "education" });
  const experience = useFieldArray({ control, name: "experience" });
  const languages = useFieldArray({ control, name: "languages" });
  const certifications = useFieldArray({ control, name: "certifications" });
  const skills = useFieldArray({ control, name: "skills" });

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-10 space-y-10">
      {/* Personal Info */}
      <div>
        <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-4 pb-2 border-b border-gray-100">
          Personal Information
        </h2>
        <div className="grid grid-cols-2 gap-4">
          {(
            ["name", "email", "phone", "address", "linkedin", "github"] as const
          ).map((field) => (
            <div key={field} className="flex flex-col gap-1">
              <label className="text-xs text-gray-400 capitalize">
                {field}
              </label>
              <input
                type="text"
                {...register(`personal_info.${field}`)}
                className="border-b border-gray-200 py-1.5 text-sm text-black outline-none focus:border-black transition-colors bg-transparent"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Summary */}
      <div>
        <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-4 pb-2 border-b border-gray-100">
          Summary
        </h2>
        <textarea
          {...register("summary")}
          rows={7}
          placeholder="Professional summary..."
          className="w-full py-1.5 text-sm text-black outline-none resize-none bg-transparent placeholder:text-gray-300"
        />
      </div>

      {/* Education */}
      <div>
        <div className="flex justify-between items-center mb-4 pb-2 border-b border-gray-100">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-400">
            Education
          </h2>
          <button
            type="button"
            onClick={() =>
              education.append({ degree: "", institution: "", year: "" })
            }
            className="cursor-pointer text-xs text-gray-400 hover:text-black transition-colors"
          >
            + Add
          </button>
        </div>
        <div className="space-y-6">
          {education.fields.map((field, index) => (
            <div key={field.id}>
              <div className="grid grid-cols-3 gap-4">
                {(["degree", "institution", "year"] as const).map((f) => (
                  <div key={f} className="flex flex-col gap-1">
                    <label className="text-xs text-gray-400 capitalize">
                      {f}
                    </label>
                    <input
                      type="text"
                      {...register(`education.${index}.${f}`)}
                      className="border-b border-gray-200 py-1.5 text-sm text-black outline-none focus:border-black transition-colors bg-transparent"
                    />
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={() => education.remove(index)}
                className="cursor-pointer mt-2 text-xs text-red-300 hover:text-red-500 transition-colors"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Experience */}
      <div>
        <div className="flex justify-between items-center mb-4 pb-2 border-b border-gray-100">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-400">
            Experience
          </h2>
          <button
            type="button"
            onClick={() =>
              experience.append({
                company: "",
                role: "",
                start_date: "",
                end_date: "",
                description: "",
              })
            }
            className="cursor-pointer text-xs text-gray-400 hover:text-black transition-colors"
          >
            + Add
          </button>
        </div>
        <div className="space-y-8">
          {experience.fields.map((field, index) => (
            <div key={field.id}>
              <div className="grid grid-cols-2 gap-4 mb-3">
                {(["company", "role", "start_date", "end_date"] as const).map(
                  (f) => (
                    <div key={f} className="flex flex-col gap-1">
                      <label className="text-xs text-gray-400 capitalize">
                        {f.replace("_", " ")}
                      </label>
                      <input
                        type="text"
                        {...register(`experience.${index}.${f}`)}
                        className="border-b border-gray-200 py-1.5 text-sm text-black outline-none focus:border-black transition-colors bg-transparent"
                      />
                    </div>
                  ),
                )}
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs text-gray-400">Description</label>
                <textarea
                  {...register(`experience.${index}.description`)}
                  rows={7}
                  className="w-full py-1.5 text-sm text-black outline-none resize-none bg-transparent border-b border-gray-200 focus:border-black transition-colors"
                />
              </div>
              <button
                type="button"
                onClick={() => experience.remove(index)}
                className="cursor-pointer mt-2 text-xs text-red-300 hover:text-red-500 transition-colors"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Skills */}
      <div>
        <div className="flex justify-between items-center mb-4 pb-2 border-b border-gray-100">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-400">
            Skills
          </h2>
          <button
            type="button"
            onClick={() => skills.append({ name: "" })}
            className="cursor-pointer text-xs text-gray-400 hover:text-black transition-colors"
          >
            + Add
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {skills.fields.map((field, index) => (
            <div
              key={field.id}
              className="flex items-center gap-1 bg-gray-100 rounded-full px-3 py-1"
            >
              <input
                type="text"
                {...register(`skills.${index}.name`)}
                className="bg-transparent text-sm text-black outline-none w-32"
              />
              <button
                type="button"
                onClick={() => skills.remove(index)}
                className="cursor-pointer text-gray-400 hover:text-black text-xs transition-colors"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Languages */}
      <div>
        <div className="flex justify-between items-center mb-4 pb-2 border-b border-gray-100">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-400">
            Languages
          </h2>
          <button
            type="button"
            onClick={() => languages.append({ language: "", proficiency: "" })}
            className="cursor-pointer text-xs text-gray-400 hover:text-black transition-colors"
          >
            + Add
          </button>
        </div>
        <div className="space-y-4">
          {languages.fields.map((field, index) => (
            <div key={field.id}>
              <div className="grid grid-cols-2 gap-4">
                {(["language", "proficiency"] as const).map((f) => (
                  <div key={f} className="flex flex-col gap-1">
                    <label className="text-xs text-gray-400 capitalize">
                      {f}
                    </label>
                    <input
                      type="text"
                      {...register(`languages.${index}.${f}`)}
                      className="border-b border-gray-200 py-1.5 text-sm text-black outline-none focus:border-black transition-colors bg-transparent"
                    />
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={() => languages.remove(index)}
                className="cursor-pointer mt-2 text-xs text-red-300 hover:text-red-500 transition-colors"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Certifications */}
      <div>
        <div className="flex justify-between items-center mb-4 pb-2 border-b border-gray-100">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-400">
            Certifications
          </h2>
          <button
            type="button"
            onClick={() =>
              certifications.append({ name: "", issuer: "", date: "" })
            }
            className="cursor-pointer text-xs text-gray-400 hover:text-black transition-colors"
          >
            + Add
          </button>
        </div>
        <div className="space-y-6">
          {certifications.fields.map((field, index) => (
            <div key={field.id}>
              <div className="grid grid-cols-3 gap-4">
                {(["name", "issuer", "date"] as const).map((f) => (
                  <div key={f} className="flex flex-col gap-1">
                    <label className="text-xs text-gray-400 capitalize">
                      {f}
                    </label>
                    <input
                      type="text"
                      {...register(`certifications.${index}.${f}`)}
                      className="border-b border-gray-200 py-1.5 text-sm text-black outline-none focus:border-black transition-colors bg-transparent"
                    />
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={() => certifications.remove(index)}
                className="cursor-pointer mt-2 text-xs text-red-300 hover:text-red-500 transition-colors"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

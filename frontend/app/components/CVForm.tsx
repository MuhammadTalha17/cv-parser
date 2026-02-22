"use client";

import { CVData } from "../lib/types";
import { useForm, useFieldArray } from "react-hook-form";
import { useEffect } from "react";

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

  const shellClass =
    "rounded-2xl border border-black/10 bg-white p-5 sm:p-6 space-y-5";

  const sectionClass =
    "rounded-xl border border-black/10 bg-[#fcfcfc] p-4 sm:p-5 space-y-4";

  const sectionHeaderClass =
    "pb-2 border-b border-black/10 text-xs font-semibold uppercase tracking-[0.18em] text-black/60";

  const labelClass = "text-xs text-black/55 capitalize";
  const inputClass =
    "w-full border-b border-black/20 bg-transparent py-1.5 text-sm text-black outline-none focus:border-black/50 transition-colors";
  const textareaClass =
    "w-full border-b border-black/20 bg-transparent py-1.5 text-sm text-black outline-none resize-none focus:border-black/50 transition-colors placeholder:text-black/35";

  const addBtnClass =
    "cursor-pointer text-xs font-semibold text-black/60 hover:text-black transition-colors";
  const removeBtnClass =
    "cursor-pointer mt-2 text-xs font-semibold text-black/50 hover:text-black transition-colors";

  return (
    <div className={shellClass}>
      <div className={sectionClass}>
        <h2 className={sectionHeaderClass}>Personal Information</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {(
            ["name", "email", "phone", "address", "linkedin", "github"] as const
          ).map((field) => (
            <div key={field} className="flex flex-col gap-1">
              <label className={labelClass}>{field}</label>
              <input
                type="text"
                {...register(`personal_info.${field}`)}
                className={inputClass}
              />
            </div>
          ))}
        </div>
      </div>

      <div className={sectionClass}>
        <h2 className={sectionHeaderClass}>Summary</h2>
        <textarea
          {...register("summary")}
          rows={7}
          placeholder="Professional summary..."
          className={textareaClass}
        />
      </div>

      <div className={sectionClass}>
        <div className="flex items-center justify-between border-b border-white/10 pb-2">
          <h2 className={sectionHeaderClass}>Education</h2>
          <button
            type="button"
            onClick={() =>
              education.append({ degree: "", institution: "", year: "" })
            }
            className={addBtnClass}
          >
            + Add
          </button>
        </div>

        <div className="space-y-6">
          {education.fields.map((field, index) => (
            <div key={field.id}>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                {(["degree", "institution", "year"] as const).map((f) => (
                  <div key={f} className="flex flex-col gap-1">
                    <label className={labelClass}>{f}</label>
                    <input
                      type="text"
                      {...register(`education.${index}.${f}`)}
                      className={inputClass}
                    />
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={() => education.remove(index)}
                className={removeBtnClass}
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className={sectionClass}>
        <div className="flex items-center justify-between border-b border-white/10 pb-2">
          <h2 className={sectionHeaderClass}>Experience</h2>
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
            className={addBtnClass}
          >
            + Add
          </button>
        </div>

        <div className="space-y-8">
          {experience.fields.map((field, index) => (
            <div key={field.id}>
              <div className="mb-3 grid grid-cols-1 gap-4 sm:grid-cols-2">
                {(["company", "role", "start_date", "end_date"] as const).map(
                  (f) => (
                    <div key={f} className="flex flex-col gap-1">
                      <label className={labelClass}>
                        {f.replace("_", " ")}
                      </label>
                      <input
                        type="text"
                        {...register(`experience.${index}.${f}`)}
                        className={inputClass}
                      />
                    </div>
                  ),
                )}
              </div>

              <div className="flex flex-col gap-1">
                <label className={labelClass}>Description</label>
                <textarea
                  {...register(`experience.${index}.description`)}
                  rows={7}
                  className={textareaClass}
                />
              </div>

              <button
                type="button"
                onClick={() => experience.remove(index)}
                className={removeBtnClass}
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className={sectionClass}>
        <div className="flex items-center justify-between border-b border-white/10 pb-2">
          <h2 className={sectionHeaderClass}>Skills</h2>
          <button
            type="button"
            onClick={() => skills.append({ name: "" })}
            className={addBtnClass}
          >
            + Add
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
          {skills.fields.map((field, index) => (
            <div
              key={field.id}
              className="flex items-center gap-2 rounded-full border border-black/15 bg-[#f3f3f3] px-3 py-1.5"
            >
              <input
                type="text"
                {...register(`skills.${index}.name`)}
                className="w-32 bg-transparent text-sm text-black outline-none"
              />
              <button
                type="button"
                onClick={() => skills.remove(index)}
                className="cursor-pointer text-black/45 hover:text-black text-xs transition-colors"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className={sectionClass}>
        <div className="flex items-center justify-between border-b border-white/10 pb-2">
          <h2 className={sectionHeaderClass}>Languages</h2>
          <button
            type="button"
            onClick={() => languages.append({ language: "", proficiency: "" })}
            className={addBtnClass}
          >
            + Add
          </button>
        </div>

        <div className="space-y-4">
          {languages.fields.map((field, index) => (
            <div key={field.id}>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {(["language", "proficiency"] as const).map((f) => (
                  <div key={f} className="flex flex-col gap-1">
                    <label className={labelClass}>{f}</label>
                    <input
                      type="text"
                      {...register(`languages.${index}.${f}`)}
                      className={inputClass}
                    />
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={() => languages.remove(index)}
                className={removeBtnClass}
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className={sectionClass}>
        <div className="flex items-center justify-between border-b border-white/10 pb-2">
          <h2 className={sectionHeaderClass}>Certifications</h2>
          <button
            type="button"
            onClick={() =>
              certifications.append({ name: "", issuer: "", date: "" })
            }
            className={addBtnClass}
          >
            + Add
          </button>
        </div>

        <div className="space-y-6">
          {certifications.fields.map((field, index) => (
            <div key={field.id}>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                {(["name", "issuer", "date"] as const).map((f) => (
                  <div key={f} className="flex flex-col gap-1">
                    <label className={labelClass}>{f}</label>
                    <input
                      type="text"
                      {...register(`certifications.${index}.${f}`)}
                      className={inputClass}
                    />
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={() => certifications.remove(index)}
                className={removeBtnClass}
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // return (
  //   <div className="bg-white border border-gray-200 rounded-xl p-10 space-y-10">
  //     {/* Personal Info */}
  //     <div className={sectionClass}>
  //       <h2 className={sectionHeaderClass}>Personal Information</h2>
  //       <div className="grid grid-cols-2 gap-4">
  //         {(
  //           ["name", "email", "phone", "address", "linkedin", "github"] as const
  //         ).map((field) => (
  //           <div key={field} className="flex flex-col gap-1">
  //             <label className={labelClass}>{field}</label>
  //             <input
  //               type="text"
  //               {...register(`personal_info.${field}`)}
  //               className={inputClass}
  //             />
  //           </div>
  //         ))}
  //       </div>
  //     </div>

  //     {/* Summary */}
  //     <div className={sectionClass}>
  //       <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-4 pb-2 border-b border-gray-100">
  //         Summary
  //       </h2>
  //       <textarea
  //         {...register("summary")}
  //         rows={7}
  //         placeholder="Professional summary..."
  //         className="w-full py-1.5 text-sm text-black outline-none resize-none bg-transparent placeholder:text-gray-300"
  //       />
  //     </div>

  //     {/* Education */}
  //     <div className={sectionClass}>
  //       <div className="flex justify-between items-center mb-4 pb-2 border-b border-gray-100">
  //         <h2 className={sectionHeaderClass}>Education</h2>
  //         <button
  //           type="button"
  //           onClick={() =>
  //             education.append({ degree: "", institution: "", year: "" })
  //           }
  //           className={addBtnClass}
  //         >
  //           + Add
  //         </button>
  //       </div>
  //       <div className="space-y-6">
  //         {education.fields.map((field, index) => (
  //           <div key={field.id}>
  //             <div className="grid grid-cols-3 gap-4">
  //               {(["degree", "institution", "year"] as const).map((f) => (
  //                 <div key={f} className="flex flex-col gap-1">
  //                   <label className={labelClass}>{f}</label>
  //                   <input
  //                     type="text"
  //                     {...register(`education.${index}.${f}`)}
  //                     className={inputClass}
  //                   />
  //                 </div>
  //               ))}
  //             </div>
  //             <button
  //               type="button"
  //               onClick={() => education.remove(index)}
  //               className={removeBtnClass}
  //             >
  //               Remove
  //             </button>
  //           </div>
  //         ))}
  //       </div>
  //     </div>

  //     {/* Experience */}
  //     <div className={sectionClass}>
  //       <div className="flex justify-between items-center mb-4 pb-2 border-b border-gray-100">
  //         <h2 className={sectionHeaderClass}>Experience</h2>
  //         <button
  //           type="button"
  //           onClick={() =>
  //             experience.append({
  //               company: "",
  //               role: "",
  //               start_date: "",
  //               end_date: "",
  //               description: "",
  //             })
  //           }
  //           className={addBtnClass}
  //         >
  //           + Add
  //         </button>
  //       </div>
  //       <div className="space-y-8">
  //         {experience.fields.map((field, index) => (
  //           <div key={field.id}>
  //             <div className="grid grid-cols-2 gap-4 mb-3">
  //               {(["company", "role", "start_date", "end_date"] as const).map(
  //                 (f) => (
  //                   <div key={f} className="flex flex-col gap-1">
  //                     <label className={labelClass}>
  //                       {f.replace("_", " ")}
  //                     </label>
  //                     <input
  //                       type="text"
  //                       {...register(`experience.${index}.${f}`)}
  //                       className={inputClass}
  //                     />
  //                   </div>
  //                 ),
  //               )}
  //             </div>
  //             <div className="flex flex-col gap-1">
  //               <label className="text-xs text-gray-400">Description</label>
  //               <textarea
  //                 {...register(`experience.${index}.description`)}
  //                 rows={7}
  //                 className="w-full py-1.5 text-sm text-black outline-none resize-none bg-transparent border-b border-gray-200 focus:border-black transition-colors"
  //               />
  //             </div>
  //             <button
  //               type="button"
  //               onClick={() => experience.remove(index)}
  //               className={removeBtnClass}
  //             >
  //               Remove
  //             </button>
  //           </div>
  //         ))}
  //       </div>
  //     </div>

  //     {/* Skills */}
  //     <div className={sectionClass}>
  //       <div className="flex justify-between items-center mb-4 pb-2 border-b border-gray-100">
  //         <h2 className={sectionHeaderClass}>Skills</h2>
  //         <button
  //           type="button"
  //           onClick={() => skills.append({ name: "" })}
  //           className={addBtnClass}
  //         >
  //           + Add
  //         </button>
  //       </div>
  //       <div className="flex flex-wrap gap-2">
  //         {skills.fields.map((field, index) => (
  //           <div
  //             key={field.id}
  //             className="flex items-center gap-2 rounded-full border border-white/20 bg-[#0d1320] px-3 py-1.5"
  //           >
  //             <input
  //               type="text"
  //               {...register(`skills.${index}.name`)}
  //               className="bg-transparent text-sm text-black outline-none w-32"
  //             />
  //             <button
  //               type="button"
  //               onClick={() => skills.remove(index)}
  //               className="cursor-pointer text-black/40 hover:text-black text-xs transition-colors"
  //             >
  //               ×
  //             </button>
  //           </div>
  //         ))}
  //       </div>
  //     </div>

  //     {/* Languages */}
  //     <div className={sectionClass}>
  //       <div className="flex justify-between items-center mb-4 pb-2 border-b border-gray-100">
  //         <h2 className={sectionHeaderClass}>Languages</h2>
  //         <button
  //           type="button"
  //           onClick={() => languages.append({ language: "", proficiency: "" })}
  //           className={addBtnClass}
  //         >
  //           + Add
  //         </button>
  //       </div>
  //       <div className="space-y-4">
  //         {languages.fields.map((field, index) => (
  //           <div key={field.id}>
  //             <div className="grid grid-cols-2 gap-4">
  //               {(["language", "proficiency"] as const).map((f) => (
  //                 <div key={f} className="flex flex-col gap-1">
  //                   <label className={labelClass}>{f}</label>
  //                   <input
  //                     type="text"
  //                     {...register(`languages.${index}.${f}`)}
  //                     className={inputClass}
  //                   />
  //                 </div>
  //               ))}
  //             </div>
  //             <button
  //               type="button"
  //               onClick={() => languages.remove(index)}
  //               className={removeBtnClass}
  //             >
  //               Remove
  //             </button>
  //           </div>
  //         ))}
  //       </div>
  //     </div>

  //     {/* Certifications */}
  //     <div className={sectionClass}>
  //       <div className="flex justify-between items-center pb-2 border-b border-white/10">
  //         <h2 className={sectionHeaderClass}>Certifications</h2>
  //         <button
  //           type="button"
  //           onClick={() =>
  //             certifications.append({ name: "", issuer: "", date: "" })
  //           }
  //           className={addBtnClass}
  //         >
  //           + Add
  //         </button>
  //       </div>
  //       <div className="space-y-6">
  //         {certifications.fields.map((field, index) => (
  //           <div key={field.id}>
  //             <div className="grid grid-cols-3 gap-4">
  //               {(["name", "issuer", "date"] as const).map((f) => (
  //                 <div key={f} className="flex flex-col gap-1">
  //                   <label className={labelClass}>{f}</label>
  //                   <input
  //                     type="text"
  //                     {...register(`certifications.${index}.${f}`)}
  //                     className={inputClass}
  //                   />
  //                 </div>
  //               ))}
  //             </div>
  //             <button
  //               type="button"
  //               onClick={() => certifications.remove(index)}
  //               className={removeBtnClass}
  //             >
  //               Remove
  //             </button>
  //           </div>
  //         ))}
  //       </div>
  //     </div>
  //   </div>
  // );
}

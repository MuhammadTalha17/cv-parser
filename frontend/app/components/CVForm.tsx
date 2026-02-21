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
  }, [data, reset]);

  const education = useFieldArray({ control, name: "education" });
  const experience = useFieldArray({ control, name: "experience" });
  const languages = useFieldArray({ control, name: "languages" });
  const certifications = useFieldArray({ control, name: "certifications" });
  const skills = useFieldArray({ control, name: "skills" });

  return (
    <div className="cv-form">
      {/* Personal Info */}
      <section className="form-section">
        <h2>Personal Information</h2>
        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input type="text" {...register("personal_info.name")} />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input type="text" {...register("personal_info.email")} />
          </div>

          <div className="form-group">
            <label htmlFor="form-group">Phone</label>
            <input type="tel" {...register("personal_info.phone")} />
          </div>

          <div className="form-group">
            <label htmlFor="form-group">Address</label>
            <input type="text" {...register("personal_info.address")} />
          </div>

          <div className="form-group">
            <label htmlFor="form-group">LinkedIn</label>
            <input type="text" {...register("personal_info.linkedin")} />
          </div>

          <div className="form-group">
            <label htmlFor="form-group">GitHub</label>
            <input type="text" {...register("personal_info.github")} />
          </div>
        </div>
      </section>

      {/*Summary*/}
      <section className="form-section">
        <h2>Professional Sumary</h2>
        <textarea
          {...register("summary")}
          rows={4}
          placeholder="Professional Summary..."
        />
      </section>

      {/*Education*/}
      <section className="form-section">
        <div className="section-header">
          <h2>Education</h2>
          <button
            type="button"
            onClick={() =>
              education.append({ degree: "", institution: "", year: "" })
            }
          >
            + Add
          </button>
        </div>

        {education.fields.map((field, index) => (
          <div key={field.id} className="repeatable-item">
            <div className="form-grid">
              <div className="form-group">
                <label>Degree</label>
                <input type="text" {...register(`education.${index}.degree`)} />
              </div>

              <div className="form-group">
                <label>Institution</label>
                <input
                  type="text"
                  {...register(`education.${index}.institution`)}
                />
              </div>

              <div className="form-group">
                <label>Year</label>
                <input type="text" {...register(`education.${index}.year`)} />
              </div>
            </div>

            <button type="button" onClick={() => education.remove(index)}>
              Remove
            </button>
          </div>
        ))}
      </section>

      {/*Experience*/}
      <section className="formn-section">
        <div className="section-header">
          <h2>Experience</h2>
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
          >
            + Add
          </button>
        </div>

        {experience.fields.map((field, index) => (
          <div key={field.id} className="repeatable-item">
            <div className="form-grid">
              <div className="form-group">
                <label>Company</label>
                <input
                  type="text"
                  {...register(`experience.${index}.company`)}
                />
              </div>

              <div className="form-group">
                <label>Role</label>
                <input type="text" {...register(`experience.${index}.role`)} />
              </div>

              <div className="form-group">
                <label>Start Date</label>
                <input
                  type="text"
                  {...register(`experience.${index}.start_date`)}
                />
              </div>

              <div className="form-group">
                <label>End Date</label>
                <input
                  type="text"
                  {...register(`experience.${index}.end_date`)}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea
                {...register(`experience.${index}.description`)}
                rows={3}
              />
            </div>

            <button type="button" onClick={() => experience.remove(index)}>
              Remove
            </button>
          </div>
        ))}
      </section>

      {/*Skills*/}
      <section className="form-section">
        <div className="section-header">
          <h2>Skills</h2>
          <button type="button" onClick={() => skills.append({ name: "" })}>
            + Add
          </button>
        </div>
        <div className="skils-grid">
          {" "}
          {skills.fields.map((field, index) => (
            <div key={field.id} className="skills-item">
              <input type="text" {...register(`skills.${index}.name`)} />
              <button type="button" onClick={() => skills.remove(index)}>
                x
              </button>
            </div>
          ))}
        </div>
      </section>

      {/*Languages*/}
      <section className="form-section">
        <div className="section-header">
          <h2>Languages</h2>
          <button
            type="button"
            onClick={() => languages.append({ language: "", proficiency: "" })}
          >
            + Add
          </button>
        </div>

        {languages.fields.map((field, index) => (
          <div key={field.id} className="repeatable-item">
            <div className="form-grid">
              <div className="form-group">
                <label>Language</label>
                <input
                  type="text"
                  {...register(`languages.${index}.language`)}
                />
              </div>

              <div className="form-group">
                <label>Proficiency</label>
                <input
                  type="text"
                  {...register(`languages.${index}.proficiency`)}
                />
              </div>
            </div>

            <button type="button" onClick={() => languages.remove(index)}>
              Remove
            </button>
          </div>
        ))}
      </section>

      {/*Certifications*/}
      <section className="form-section">
        <div className="section-header">
          <h2>Certifications</h2>
          <button
            type="button"
            onClick={() =>
              certifications.append({ name: "", issuer: "", date: "" })
            }
          >
            + Add
          </button>
        </div>

        {certifications.fields.map((field, index) => (
          <div key={field.id} className="repeatable-item">
            <div className="form-grid">
              <div className="form-group">
                <label>Certification Name</label>
                <input
                  type="text"
                  {...register(`certifications.${index}.name`)}
                />
              </div>

              <div className="form-group">
                <label>Issuer</label>
                <input
                  type="text"
                  {...register(`certifications.${index}.issuer`)}
                />
              </div>

              <div className="form-group">
                <label>Date</label>
                <input
                  type="text"
                  {...register(`certifications.${index}.date`)}
                />
              </div>
            </div>

            <button type="button" onClick={() => certifications.remove(index)}>
              Remove
            </button>
          </div>
        ))}
      </section>
    </div>
  );
}

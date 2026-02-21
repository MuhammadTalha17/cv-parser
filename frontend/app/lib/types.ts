export interface PersonalInfo {
  name: string;
  email: string;
  phone: string;
  address: string;
  linkedin: string;
  github: string;
}

interface Education {
  degree: string;
  institution: string;
  year: string;
}

interface Experience {
  company: string;
  role: string;
  start_date: string;
  end_date: string;
  description: string;
}

interface Language {
  language: string;
  proficiency: string;
}

interface Certification {
  name: string;
  issuer: string;
  date: string;
}

export interface CVData {
  personal_info: PersonalInfo;
  summary: string;
  education: Education[];
  experience: Experience[];
  skills: { name: string }[];
  languages: Language[];
  certifications: Certification[];
}

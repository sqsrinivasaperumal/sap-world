export interface JobPosting {
  id: number;
  title: string;
  type: string;
  employer_role_type: string;
  description: string;
  salary_type: number;
  salary_currency: string;
  salary: number;
  city: string;
  state: string;
  country: string;
  zipcode: number;
  availability: number;
  remote: any;
  experience: number;
  sap_experience: number;
  latlng: string;
  location: string;
  health_wellness: string;
  paid_off: string;
  financial_benefits: string;
  office_perks: string;
  language: string;
  facing_role: string;
  training_experience: string;
  domain: Array<any>;
  authorized_to_work: Array<any>;
  match_select: Array<any>;
  education: Array<any>;
  hands_on_experience: Array<any>;
  extra_criteria: Array<any>;
  temp_extra_criteria: Array<any>;
  skills: Array<any>;
  programming_skills: Array<string>;
  optinal_skills: Array<string>;
  certification: Array<string>;
  job_locations: Array<any>;
  screening_process: Array<string>;
  others: Array<string>;
  work_authorization: number;
  visa_sponsorship: boolean;
  entry: boolean;
  willing_to_relocate: boolean;
  negotiable: boolean;
  need_reference: any;
  company: any;
  is_job_applied: any;
  end_to_end_implementation: number;
  contract_duration: number;
  latlng_text: any;
  job_applied: any;
  min: any;
  max: any;
  travel_opportunity: number;
}

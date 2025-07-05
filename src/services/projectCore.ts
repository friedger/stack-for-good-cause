export interface Project {
  id: string;
  name: string;
  description: string;
  category: string;
  totalRaised: number;
  backers: number;
  status: "approved" | "pending";
  creator: string;
  stxAddress: string;
  image: string;
  slug: string;
  fullDescription?: string;
  updates?: Array<{
    id: string;
    title: string;
    content: string;
    date: string;
    nostrEventId?: string;
  }>;
  backersList?: Array<{
    id: string;
    name: string;
    amount: number;
    date: string;
    message?: string;
  }>;
}

export interface CreateProjectData {
  name: string;
  description: string;
  category: string;
  image: File | null;
}

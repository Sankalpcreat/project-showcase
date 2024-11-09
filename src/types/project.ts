export interface Project {
  id: string;
  name: string;
  description: string;
  image: string;
  techStack: string[];
  demoUrl?: string;
  githubUrl?: string;
  date: string;
}
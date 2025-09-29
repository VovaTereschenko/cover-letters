export type SavedApplication = {
  id: string;
  title: string;
  company: string;
  jobTitle: string;
  content: string;
  createdAt: string;
};

export async function getApplications(): Promise<SavedApplication[]> {
  return [];
}

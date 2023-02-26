export default interface Project {
  project_id: string;
  user_id: string;
  title: string;
  description: string | undefined;
  created_at: string;
  deadline: string;
}

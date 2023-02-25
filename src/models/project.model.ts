export default interface Project {
  id: string;
  title: string;
  description: string | undefined;
  team_leader_id: string;
  created: string;
  deadline: string;
  completed: boolean;
}

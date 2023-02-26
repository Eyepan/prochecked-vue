export default interface Task {
  task_id: string;
  project_id: string;
  title: string;
  description: string;
  due_date: string;
  priority: number;
  completed: number;
}

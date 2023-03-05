import axios from "axios";
const apiUrl = import.meta.env.VITE_API_URL;
import type User from "@/models/user.model";
import type Project from "@/models/project.model";
import type Task from "@/models/task.model";

export async function signin(
  email: string,
  password: string
): Promise<User | number> {
  let user: User = {
    user_id: "",
    name: "",
    email: "",
    password: "",
  };
  let status = 200;
  await axios
    .post(apiUrl + "users/signin", {
      email: email,
      password: password,
    })
    .then((response) => {
      user = response.data;
    })
    .catch((error) => {
      if (error.response) {
        if (error.response.status === 404) {
          console.log("user doesn't exist");
          status = 404;
        } else {
          console.log("internal server error");
          status = 500;
        }
      }
    });
  if (status !== 200) {
    return status;
  } else {
    return user;
  }
}

export async function signup(
  name: string,
  email: string,
  password: string
): Promise<number | User> {
  let user: User = {
    user_id: "",
    name: "",
    email: "",
    password: "",
  };
  let status = 200;
  await axios
    .post(apiUrl + "users", {
      name: name,
      email: email,
      password: password,
    })
    .then((response) => {
      user = response.data;
    })
    .catch((error) => {
      if (error.response) {
        if (error.response.status === 409) {
          console.log("email already in use");
          status = 409;
        }
      } else {
        console.log("internal server error");
        status = 500;
      }
    });
  if (status !== 200) {
    return status;
  } else {
    return user;
  }
}

export async function getUserProjects(user_id: string): Promise<Project[]> {
  let projects: Project[] = [];
  let status = 200;
  await axios
    .get(apiUrl + "projects/" + user_id)
    .then((response) => {
      projects = response.data;
    })
    .catch((error) => {
      if (error.response && error.response.status !== 200) {
        return error.response.status;
      }
    });

  return projects;
}

export async function getProjectById(user_id: string, project_id: string) {
  let project: Project = {
    project_id: "",
    user_id: "",
    title: "",
    description: "",
    created_at: "",
    deadline: "",
  };
  let status = 200;
  await axios
    .get(apiUrl + "projects/" + user_id + "/" + project_id)
    .then((response) => {
      project = response.data;
    })
    .catch((error) => {
      if (error.response) {
        status = error.response.status;
      } else {
        status = 500;
      }
    });

  if (status !== 200) {
    return status;
  } else {
    return project;
  }
}

export async function createNewProject(
  user_id: string,
  title: string,
  description: string,
  created_at: string,
  deadline: string
): Promise<Project | number> {
  let status = 200;
  let project: Project = {
    project_id: "",
    user_id: "",
    title: "",
    description: "",
    created_at: "",
    deadline: "",
  };
  await axios
    .post(apiUrl + "projects/" + user_id, {
      title: title,
      description: description,
      created_at: created_at,
      deadline: deadline,
    })
    .then((response) => {
      project = response.data;
    })
    .catch((error) => {
      if (error.response) {
        status = error.response.status;
      }
    });

  if (status !== 200) {
    return status;
  } else {
    return project;
  }
}

export async function deleteProject(
  user_id: string,
  project_id: string
): Promise<number> {
  let status = 200;
  await axios
    .delete(apiUrl + "projects/" + user_id + "/" + project_id)
    .catch((error) => {
      if (error.response && error.response.status !== 200) {
        status = error.response.status;
      }
    });
  return status;
}

export async function getTasksOfProject(user_id: string, project_id: string) {
  let tasks: Task[] = [];
  let status = 200;
  await axios
    .get(apiUrl + "tasks/" + user_id + "/" + project_id)
    .then((response) => {
      tasks = response.data;
    })
    .catch((error) => {
      if (error.response) {
        status = error.response.status;
      }
    });
  if (status !== 200) {
    if (status !== 404) {
      return status;
    } else {
      return tasks;
    }
  }
  return tasks;
}

export async function addTaskToProject(
  user_id: string,
  project_id: string,
  title: string,
  description: string,
  due_date: string,
  priority: number,
  completed: number
) {
  let status = 200;
  let task: Task = {
    task_id: "",
    project_id: "",
    title: "",
    description: "",
    due_date: "",
    priority: 0,
    completed: 0,
  };
  await axios
    .post(apiUrl + "tasks/" + user_id + "/" + project_id, {
      title: title,
      description: description,
      due_date: due_date,
      priority: priority,
      completed: completed,
    })
    .then((response) => {
      task = response.data;
    })
    .catch((error) => {
      if (error.response) {
        status = error.response.status;
      }
    });

  if (status !== 200) {
    return status;
  } else {
    return task;
  }
}

export async function completeTask(
  user_id: string,
  project_id: string,
  task_id: string
) {
  let status = 200;
  let task: Task = {
    task_id: "",
    project_id: "",
    title: "",
    description: "",
    due_date: "",
    priority: 0,
    completed: 0,
  };

  await axios
    .put(apiUrl + "tasks/" + user_id + "/" + project_id + "/" + task_id, {
      completed: 1,
    })
    .then((response) => {
      task = response.data;
    })
    .catch((error) => {
      if (error.response) {
        status = error.response.status;
      }
    });

  if (status !== 200) {
    return status;
  }
  return task;
}

export async function incompleteTask(
  user_id: string,
  project_id: string,
  task_id: string
) {
  let status = 200;
  let task: Task = {
    task_id: "",
    project_id: "",
    title: "",
    description: "",
    due_date: "",
    priority: 0,
    completed: 0,
  };

  await axios
    .put(apiUrl + "tasks/" + user_id + "/" + project_id + "/" + task_id, {
      completed: 0,
    })
    .then((response) => {
      task = response.data;
    })
    .catch((error) => {
      if (error.response) {
        status = error.response.status;
      }
    });

  if (status !== 200) {
    return status;
  }
  return task;
}

export async function deleteTask(
  user_id: string,
  project_id: string,
  task_id: string
) {
  let status = 200;
  await axios
    .delete(apiUrl + "tasks/" + user_id + "/" + project_id + "/" + task_id)
    .catch((error) => {
      if (error.response) {
        status = error.response.status;
      }
    });
  return status;
}

export async function getAllUserTasks(
  user_id: string
): Promise<Task[] | number> {
  let tasks: Task[] = [];
  let status = 200;
  await axios
    .get(apiUrl + "tasks/" + user_id)
    .then((response) => {
      tasks = response.data;
    })
    .catch((error) => {
      status = error.response.status;
    });
  if (status !== 200) {
    if (status === 404) {
      return [];
    } else {
      return status;
    }
  }
  return tasks;
}

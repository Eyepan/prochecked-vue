import axios from "axios";
const apiUrl = import.meta.env.VITE_API_URL;
import type User from "@/models/user.model";
import type Project from "@/models/project.model";
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

export async function getUserProjects(
  user_id: string
): Promise<number | Project[]> {
  let projects: Project[] = [];
  let status = 200;
  await axios
    .get(apiUrl + "projects/" + user_id)
    .then((response) => {
      projects = response.data;
    })
    .catch((error) => {
      if (error.response) {
        if (error.response.status === 404) {
          status = 404;
        }
      } else {
        status = 500;
      }
    });

  if (status !== 200) {
    return status;
  } else {
    return projects;
  }
}
// {
//   "project_id": "1cb833e5-66eb-4e87-8407-f6010e1d1594",
//   "user_id": "71c28fd9-661a-4286-8b2f-6ed291523460",
//   "title": "balloon",
//   "description": "a note taking application",
//   "created_at": "26-02-2023",
//   "deadline": "3-3-2023"
// }

export async function createNewProject(
  user_id: string,
  title: string,
  description: string,
  created_at: string,
  deadline: string
): Promise<number | Project> {
  let status = 200;
  let project: Project = {
    project_id: "",
    user_id: "",
    title: "",
    description: "",
    created_at: "",
    deadline: "",
    completed: false,
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
      if (error.response) {
        status = error.response.status;
      }
    });

  return status;
}

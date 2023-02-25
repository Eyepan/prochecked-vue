import SignIn from "@/views/SignIn.vue";
import { createRouter, createWebHistory } from "vue-router";
import Landing from "../views/Landing.vue";
import SignUp from "../views/SignUp.vue";
import Dashboard from "@/views/Dashboard.vue";
import DashboardHome from "@/views/dashboard/DashboardHome.vue";
import DashboardProjects from "@/views/dashboard/DashboardProjects.vue";
import DashboardProfile from "@/views/dashboard/DashboardProfile.vue";
import DashboardCreateNewProject from "@/views/dashboard/DashboardCreateNewProject.vue";
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "landing",
      component: Landing,
    },
    {
      path: "/signup",
      name: "signup",
      component: SignUp,
    },
    {
      path: "/signin",
      name: "signin",
      component: SignIn,
    },
    {
      path: "/dashboard",
      name: "dashboard",
      component: Dashboard,
      children: [
        {
          path: "/",
          redirect: "/home",
        },
        {
          path: "/home",
          name: "home",
          component: DashboardHome,
        },
        {
          path: "/projects",
          name: "projects",
          component: DashboardProjects,
        },
        {
          path: "/profile",
          name: "profile",
          component: DashboardProfile,
        },
        {
          path: "/create",
          name: "create",
          component: DashboardCreateNewProject,
        },
      ],
    },
  ],
});

export default router;

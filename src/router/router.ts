import SignIn from "@/views/SignIn.vue";
import { createRouter, createWebHistory } from "vue-router";
import Landing from "../views/Landing.vue";
import SignUp from "../views/SignUp.vue";
import Dashboard from "@/views/Dashboard.vue";
import DashboardHome from "@/views/dashboard/DashboardHome.vue";
import DashboardProject from "@/views/dashboard/DashboardProject.vue";
import DashboardProfile from "@/views/dashboard/DashboardProfile.vue";
import DashboardCreateNewProject from "@/views/dashboard/DashboardCreateNewProject.vue";
import Settings from "@/views/dashboard/DashboardSettings.vue";
import DashboardEditProject from "@/views/dashboard/DashboardEditProject.vue";
import ErrorDisplayer from "@/components/ErrorDisplayer.vue";
import NProgress from "nprogress";

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
          path: "/dashboard",
          name: "home",
          component: DashboardHome,
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
        {
          path: "/project/:id",
          name: "project",
          component: DashboardProject,
        },
        {
          path: "/settings",
          name: "settings",
          component: Settings,
        },
        {
          path: "/edit-project/:id",
          name: "editproject",
          component: DashboardEditProject,
        },
      ],
    },
    {
      path: "/:pathMatch(.*)",
      name: "not-found",
      component: ErrorDisplayer,
    },
  ],
});

router.beforeResolve((to, from, next) => {
  if (to.name) {
    NProgress.start();
  }
  next();
});

router.afterEach((to, from) => {
  NProgress.done();
});

export default router;

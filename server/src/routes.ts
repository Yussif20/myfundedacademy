import express, { Application, Router } from "express";
import { AuthRoutes } from "./app/auth/auth.route";
import { UsersRoutes } from "./app/users/users.route";

const router: Router = express.Router();

const moduleRoutes: ModuleRoute[] = [
  { path: "/auth", route: AuthRoutes },
  { path: "/users", route: UsersRoutes },
  // Batch 2: CoursesRoutes, SectionsRoutes, LessonsRoutes
  // Batch 3: CategoriesRoutes
  // ...
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;

type ModuleRoute = {
  path: string;
  route: Router | Application;
};

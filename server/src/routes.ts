import express, { Application, Router } from "express";
import { AuthRoutes } from "./app/auth/auth.route";
import { UsersRoutes } from "./app/users/users.route";
import { CategoriesRoutes } from "./app/categories/categories.route";
import { InstructorsRoutes } from "./app/instructors/instructors.route";
import { CoursesRoutes } from "./app/courses/courses.route";
import { UploadsRoutes } from "./app/uploads/uploads.route";

const router: Router = express.Router();

const moduleRoutes: ModuleRoute[] = [
  { path: "/auth", route: AuthRoutes },
  { path: "/users", route: UsersRoutes },
  { path: "/categories", route: CategoriesRoutes },
  { path: "/instructors", route: InstructorsRoutes },
  { path: "/courses", route: CoursesRoutes },
  { path: "/uploads", route: UploadsRoutes },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;

type ModuleRoute = {
  path: string;
  route: Router | Application;
};

import express, { Application, Router } from "express";

const router: Router = express.Router();

const moduleRoutes: ModuleRoute[] = [
  // Modules will be registered here as they ship.
  // Batch 1: AuthRoutes, UsersRoutes
  // Batch 2: CoursesRoutes, SectionsRoutes, LessonsRoutes
  // Batch 3: AdminModerationRoutes, CategoriesRoutes
  // ...
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;

type ModuleRoute = {
  path: string;
  route: Router | Application;
};

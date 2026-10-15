import express, { Application, Router } from "express";
import { AuthRoutes } from "./app/auth/auth.route";
import { UsersRoutes } from "./app/users/users.route";
import { CategoriesRoutes } from "./app/categories/categories.route";
import { InstructorsRoutes } from "./app/instructors/instructors.route";
import { CoursesRoutes } from "./app/courses/courses.route";
import { UploadsRoutes } from "./app/uploads/uploads.route";
import { OrdersRoutes } from "./app/orders/orders.route";
import { SubscriptionsRoutes } from "./app/subscriptions/subscriptions.route";
import { EnrollmentsRoutes } from "./app/enrollments/enrollments.route";
import { QuizzesRoutes } from "./app/quizzes/quizzes.route";
import { ReviewsRoutes } from "./app/reviews/reviews.route";
import { InternalRoutes } from "./app/demo/demo.route";

const router: Router = express.Router();

const moduleRoutes: ModuleRoute[] = [
  { path: "/auth", route: AuthRoutes },
  { path: "/users", route: UsersRoutes },
  { path: "/categories", route: CategoriesRoutes },
  { path: "/instructors", route: InstructorsRoutes },
  { path: "/courses", route: CoursesRoutes },
  { path: "/uploads", route: UploadsRoutes },
  { path: "/orders", route: OrdersRoutes },
  { path: "/subscriptions", route: SubscriptionsRoutes },
  { path: "/enrollments", route: EnrollmentsRoutes },
  { path: "/quizzes", route: QuizzesRoutes },
  { path: "/reviews", route: ReviewsRoutes },
  { path: "/internal", route: InternalRoutes },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;

type ModuleRoute = {
  path: string;
  route: Router | Application;
};

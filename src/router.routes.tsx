import { createBrowserRouter } from "react-router-dom";
import CardGenerator from "./CardGenerator";
import Landing from "./Landing";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Landing onStartCreating={() => {}} />,
  },
  {
    path: "/create",
    element: <CardGenerator onBackToLanding={() => {}} />,
  },
]);

export default router;

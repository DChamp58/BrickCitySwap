import { Outlet } from "react-router";
import { Navbar } from "./components/Navbar";

export function Root() {
  return (
    <div className="size-full flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}

import { Outlet } from "react-router-dom";
import Header from "./Header";

const AppLayout = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="mx-auto w-full max-w-360 px-6 py-8 sm:px-8 lg:px-10">
        <Outlet />
      </main>
    </div>
  );
};

export default AppLayout;

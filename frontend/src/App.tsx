import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import { AppToaster } from "./lib/toastConfig";
import AppLayout from "./ui/AppLayout";
import Leads from "./pages/Leads";
import PageNotFound from "./pages/PageNotFound";

const App = () => {
  return (
    <BrowserRouter>
      <AppToaster />

      <Routes>
        <Route element={<AppLayout />}>
          <Route index element={<Navigate to="/leads" replace />} />

          <Route path="/leads" element={<Leads />} />
        </Route>

        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;

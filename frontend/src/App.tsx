import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import { AppToaster } from "./lib/toastConfig";

import AppLayout from "./ui/AppLayout";
import Leads from "./pages/Leads";
import PageNotFound from "./pages/PageNotFound";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools/production";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 0,
    },
  },
});

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools initialIsOpen={false} />
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
    </QueryClientProvider>
  );
};

export default App;

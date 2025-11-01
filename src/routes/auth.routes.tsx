import { Routes, Route } from "react-router-dom";

import { SignIn } from "@/pages/auth/sign-in";

export function AuthRoutes() {
  return (
    <Routes>
      <Route index path="/" element={<SignIn />} />
      <Route path="*" element={<p>Página não encontrada.</p>} />
    </Routes>
  );
}

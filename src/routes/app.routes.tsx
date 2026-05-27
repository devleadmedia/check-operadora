import { Routes, Route } from 'react-router-dom'

import { Header } from '@/components/header'
import { User } from '@/pages/app/user'
import { Checker } from '@/pages/app/checker'
import UserProfile from '@/pages/app/profile/components/user-profile'
import { Footer } from '@/components/footer'
import { GenerateBase } from '@/pages/app/generate-base'
import { HistoricApi } from '@/pages/app/historic-api'
import { DocumentationApi } from '@/pages/app/documentation-api'
import { SupportPage } from '@/pages/app/support'
import { StatementPage } from '@/pages/app/statement/statementPage'
import { MyCredits } from '@/pages/app/my-credits'
import { Roles } from '@/enums/Roles.enum'
import { useAuth } from '@/contexts/auth'
import { Clients } from '@/pages/app/clients'

export function AppRoutes() {
  const { user } = useAuth()

  return (
    <div className="flex flex-col">
      <Header />
      {/* caso queria voltar a deixar o footer fixo: overflow-y-auto */}
      <main className="flex-1 h-screen">
        <div className="max-w-[95%] mx-auto py-10 px-3 mt-[72px]">
          <Routes>
            <Route index element={<Checker />} />

            <Route path="/api" element={<HistoricApi />} />
            <Route path="/api/lista" element={<HistoricApi />} />
            <Route path="/api/documentacao" element={<DocumentationApi />} />
            <Route path="/api/historico" element={<HistoricApi />} />

            {user?.role === Roles.admin && <Route path="/usuarios" element={<User />} />}
            {user?.role === Roles.admin && <Route path="/clientes" element={<Clients />} />}
            <Route path="/perfil" element={<UserProfile />} />
            <Route path="/checker" element={<Checker />} />
            <Route path="/gerar-base" element={<GenerateBase />} />
            <Route path="/support" element={<SupportPage />} />
            <Route path="/meus-creditos" element={<MyCredits />} />
            <Route path="/extrato" element={<StatementPage />} />
            <Route path="*" element={<p>Página não encontrada.</p>} />
          </Routes>
        </div>
      </main>
      <Footer />
    </div>
  )
}

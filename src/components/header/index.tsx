import { LinksHeader } from './components/links'
import { Profile } from '@/pages/app/profile'
import Logo from '@/assets/checkoperadora.png'
import { useHeaderController } from './controller'
import { Loader2, Server } from 'lucide-react'
import { usePageNavigation } from '@/hooks/use-pages-navigation'
import { NavigationHoverCard } from './components/navigation-hover-card'
import { Badge } from '../ui/badge'
import { moneyFormat } from '@/utils/money.util'
import { useClientCredits } from '@/hooks/use-client-credits'
import { useAuth } from '@/contexts/auth'
import { Link } from 'react-router-dom'

export function Header() {
  const { userData, route } = useHeaderController()
  const { isBootstrapping } = useAuth()
  const { credits, isLoading } = useClientCredits()
  const { navigationLinks, apiSubmenus, isRouteActive } = usePageNavigation()
  const { navigate } = route
  const { user } = userData

  return (
    <header className="bg-card shadow-md fixed w-full z-50">
      <div className="flex justify-between items-center w-full max-w-[95%] mx-auto py-3 px-3">
        <div className="flex items-end justify-start flex-row gap-5">
          <Link to={'/'}>
            <img className="w-52" src={Logo} alt="Check Operadora" />
          </Link>
        </div>

        <div className="flex flex-1 mx-4 min-w-0">
          <div className="flex-1 overflow-x-auto scrollbar-hide">
            <div className="flex items-center justify-center gap-1 min-w-max px-2">
              {navigationLinks.map((link, index) => {
                const IconComponent = link.icon
                const isActive = isRouteActive(link.route, location.pathname)

                return (
                  <div key={link.route} className="flex items-center gap-1">
                    <div className="group relative">
                      <div className="absolute inset-0 bg-white/20 dark:bg-white/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                      <div
                        onClick={() => navigate(link.route)}
                        className="relative flex flex-col items-center gap-1 px-2 py-1.5 rounded-lg cursor-pointer"
                      >
                        <IconComponent
                          size={16}
                          className={`flex-shrink-0 transition-colors duration-200 ${
                            isActive
                              ? 'text-[#aa71ff]'
                              : 'text-zinc-600 dark:text-zinc-300 group-hover:text-[#aa71ff]'
                          }`}
                        />
                        <LinksHeader nameLink={link.nameLink} route={link.route} />
                      </div>
                    </div>

                    {index === 0 && (
                      <NavigationHoverCard items={apiSubmenus}>
                        <div className="group relative">
                          <div className="absolute inset-0 bg-white/20 dark:bg-white/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                          <div className="relative flex flex-col items-center gap-1 px-2 py-1.5 rounded-lg cursor-pointer">
                            <Server
                              size={16}
                              className={`flex-shrink-0 transition-colors duration-200 ${
                                isRouteActive('/api', location.pathname)
                                  ? 'text-[#aa71ff]'
                                  : 'text-zinc-600 dark:text-zinc-300 group-hover:text-[#aa71ff]'
                              }`}
                            />
                            <span
                              className={`text-[10px] lg:text-xs font-bold whitespace-nowrap transition-colors ${
                                isRouteActive('/api', location.pathname)
                                  ? 'text-[#aa71ff]'
                                  : 'text-zinc-700 dark:text-white group-hover:text-[#aa71ff]'
                              }`}
                            >
                              API
                            </span>
                          </div>
                        </div>
                      </NavigationHoverCard>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1">
          {isBootstrapping ? (
            <>
              <div className="flex items-center gap-1 animate-pulse">
                <Loader2 size={16} className="animate-spin" />
                <small>Carregando...</small>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2">
              {isLoading ? (
                <Loader2 className="animate-spin" />
              ) : (
                <Badge variant="default">{moneyFormat(credits)}</Badge>
              )}

              <Profile userData={user} />
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

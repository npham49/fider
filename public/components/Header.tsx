import React, { useState } from "react"
import { SignInModal, TenantLogo, NotificationIndicator, UserMenu, ThemeSwitcher } from "@fider/components"
import { useFider } from "@fider/hooks"
import { HStack } from "./layout"
import { Trans } from "@lingui/react/macro"

export const Header = () => {
  const fider = useFider()
  const [isSignInModalOpen, setIsSignInModalOpen] = useState(false)

  const showModal = (e: React.MouseEvent) => {
    e.preventDefault()
    setIsSignInModalOpen(true)
  }

  const hideModal = () => setIsSignInModalOpen(false)

  return (
    <div id="c-header" className="bg-white">
      <SignInModal isOpen={isSignInModalOpen} onClose={hideModal} />
      <HStack className="c-menu shadow p-4 w-full">
        <div className="container">
          <HStack justify="between">
            <a href="/" className="flex flex-x flex-items-center flex--spacing-2 h-8">
              <TenantLogo size={100} />
              <h1 className="text-header">{fider.session.tenant.name}</h1>
            </a>
            {fider.session.isAuthenticated && (
              <HStack spacing={2}>
                <ThemeSwitcher />
                <NotificationIndicator />
                <UserMenu />
              </HStack>
            )}
            {!fider.session.isAuthenticated && (
              <HStack spacing={2}>
                <ThemeSwitcher />
                <a href="#" className="uppercase text-sm" onClick={showModal}>
                  <Trans id="action.signin">Sign in</Trans>
                </a>
              </HStack>
            )}
          </HStack>
        </div>
      </HStack>
    </div>
  )
}

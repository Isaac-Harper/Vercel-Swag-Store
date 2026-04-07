'use client'

import { createContext, useContext, type ReactNode } from 'react'

// Create a context for the nonce
const NonceContext = createContext<string>('')

// Provider component
export function NonceProvider({ children, nonce }: { children: ReactNode; nonce: string }) {
	return <NonceContext.Provider value={nonce}>{children}</NonceContext.Provider>
}

// Hook to use the nonce in client components
export function useNonce(): string {
	return useContext(NonceContext)
}

"use client"

import { createContext, useContext } from "react"

const PreviewModeContext = createContext(false)

export const PreviewModeProvider = PreviewModeContext.Provider

export const usePreviewMode = (): boolean => useContext(PreviewModeContext)
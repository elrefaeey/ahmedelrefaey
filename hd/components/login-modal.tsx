"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { X, Lock } from "lucide-react"

interface LoginModalProps {
  isOpen: boolean
  onClose: () => void
  onLogin: () => void
  currentLang: string
}

export default function LoginModal({ isOpen, onClose, onLogin, currentLang }: LoginModalProps) {
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const getText = (enText: string, arText: string) => {
    return currentLang === "ar" ? arText : enText
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (password === "0109294") {
      onLogin()
      setPassword("")
      setError("")
    } else {
      setError(getText("Incorrect password", "كلمة مرور خاطئة"))
    }
  }

  const handleClose = () => {
    setPassword("")
    setError("")
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5" />
            {getText("Admin Access", "دخول الإدارة")}
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={handleClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">{getText("Password", "كلمة المرور")}</label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={getText("Enter admin password", "أدخل كلمة مرور الإدارة")}
                autoFocus
              />
              {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
            </div>
            <Button type="submit" className="w-full">
              {getText("Login", "دخول")}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

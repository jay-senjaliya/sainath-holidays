import { Outlet } from "react-router-dom"

export function AuthLayout() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-500">
            Wanderlust
          </h1>
          <p className="text-muted-foreground mt-2">Sign in to your account</p>
        </div>
        <Outlet />
      </div>
    </div>
  )
}

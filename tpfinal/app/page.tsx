import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground p-4">
      <div className="text-center space-y-6 max-w-md">
        <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">Bienvenido</h1>
        <p className="text-xl text-muted-foreground">
          Estamos encantados de tenerte aquí. ¿Qué te gustaría hacer?
        </p>
        <div className="flex flex-col sm:flex-row gap-4 mt-8">
          <button className="w-full sm:w-auto">
            <Link href="/register">Registrarse</Link>
          </button>
          <button variant="outline" className="w-full sm:w-auto">
            <Link href="/login">Iniciar sesión</Link>
          </button>
        </div>
      </div>
    </div>
  )
}
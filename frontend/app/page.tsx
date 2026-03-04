import { DashboardHeader } from "@/components/dashboard-header"
import { Dashboard } from "@/components/dashboard"

export default function Page() {
  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      <main>
        <Dashboard />
      </main>
      <footer className="mt-8 border-t border-border/70 bg-card/80 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-2 sm:flex-row">
            <p className="text-xs text-muted-foreground">
              LendWise v1.5 - Credit Decision Dashboard
            </p>
            <p className="text-xs text-muted-foreground">
              Pre-trained model inference with policy-based recommendations
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

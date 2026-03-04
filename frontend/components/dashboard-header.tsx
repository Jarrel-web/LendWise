import { Badge } from "@/components/ui/badge"
import { Shield, Sparkles } from "lucide-react"

export function DashboardHeader() {
  return (
    <header className="border-b border-border/70 bg-card/85 backdrop-blur-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
            <Shield className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-foreground">
              LendWise
            </h1>
            <p className="text-xs text-muted-foreground">
              Credit Decision Console for Loan Officers
            </p>
          </div>
        </div>
        <div className="hidden items-center gap-2 sm:flex">
          <Badge variant="outline" className="text-xs border-primary/30 text-primary">
            <Sparkles className="mr-1 h-3 w-3" />
            Decision Brief
          </Badge>
          <Badge variant="outline" className="text-xs border-primary/30 text-primary">
            Decision Tree
          </Badge>
          <Badge variant="outline" className="text-xs border-success/30 text-success">
            Naive Bayes
          </Badge>
          <Badge variant="outline" className="text-xs border-warning/30 text-warning-foreground">
            K-NN
          </Badge>
        </div>
      </div>
    </header>
  )
}

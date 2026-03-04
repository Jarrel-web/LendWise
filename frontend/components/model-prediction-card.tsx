"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { TreePine, Brain, Users } from "lucide-react"
import type { ModelPrediction } from "@/lib/prediction-engine"

interface ModelPredictionCardProps {
  prediction: ModelPrediction
}

const modelIcons: Record<string, React.ReactNode> = {
  "Decision Tree": <TreePine className="h-5 w-5" />,
  "Naive Bayes": <Brain className="h-5 w-5" />,
  "K-NN": <Users className="h-5 w-5" />,
}

export function ModelPredictionCard({ prediction }: ModelPredictionCardProps) {
  const isGranted = prediction.decision === "Grant"
  const probPercent = Math.round(prediction.probability_default * 100)

  const riskLevel =
    probPercent < 30 ? "Low" : probPercent < 60 ? "Medium" : "High"

  const riskColor =
    riskLevel === "Low"
      ? "bg-success text-success-foreground"
      : riskLevel === "Medium"
        ? "bg-warning text-warning-foreground"
        : "bg-destructive text-destructive-foreground"

  return (
    <Card className="border-border/60 transition-all hover:shadow-md">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
              {modelIcons[prediction.model]}
            </div>
            <div>
              <CardTitle className="text-base">{prediction.model}</CardTitle>
              <p className="text-xs text-muted-foreground">{prediction.concept}</p>
            </div>
          </div>
          <Badge
            className={
              isGranted
                ? "bg-success/15 text-success border-success/30 hover:bg-success/15"
                : "bg-destructive/15 text-destructive border-destructive/30 hover:bg-destructive/15"
            }
            variant="outline"
          >
            {prediction.decision}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {/* Probability Bar */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Risk</span>
            <span className="font-mono font-semibold">
              {(prediction.probability_default * 100).toFixed(2)}%
            </span>
          </div>
          <Progress
            value={probPercent}
            className="h-2.5"
          />
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Safe</span>
            <Badge variant="outline" className={`text-[10px] px-1.5 py-0 ${riskColor} border-0`}>
              {riskLevel} Risk
            </Badge>
            <span>Risk</span>
          </div>
        </div>

        {/* Probabilities */}
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-lg bg-secondary/50 p-2.5">
            <p className="text-[10px] uppercase tracking-wide text-muted-foreground">
              Safe
            </p>
            <p className="font-mono text-lg font-bold text-foreground">
              {(prediction.probability_non_default * 100).toFixed(1)}%
            </p>
          </div>
          <div className="rounded-lg bg-secondary/50 p-2.5">
            <p className="text-[10px] uppercase tracking-wide text-muted-foreground">
              Confidence
            </p>
            <p className="font-mono text-lg font-bold text-foreground">
              {(prediction.confidence * 100).toFixed(1)}%
            </p>
          </div>
        </div>

        {/* Description */}
        <p className="text-xs leading-relaxed text-muted-foreground">
          {prediction.description}
        </p>
      </CardContent>
    </Card>
  )
}

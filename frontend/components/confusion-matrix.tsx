"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Grid3X3 } from "lucide-react"
import type { ConfusionMatrix as ConfusionMatrixType } from "@/lib/prediction-engine"

interface ConfusionMatrixProps {
  matrices: ConfusionMatrixType[]
}

function MatrixCell({
  value,
  label,
  type,
}: {
  value: number
  label: string
  type: "tp" | "fp" | "tn" | "fn"
}) {
  const colorMap = {
    tp: "bg-success/15 text-success border-success/20",
    tn: "bg-success/10 text-success border-success/15",
    fp: "bg-destructive/15 text-destructive border-destructive/20",
    fn: "bg-warning/15 text-warning-foreground border-warning/20",
  }

  return (
    <div
      className={`flex flex-col items-center justify-center rounded-lg border p-3 ${colorMap[type]}`}
    >
      <span className="font-mono text-xl font-bold">{value}</span>
      <span className="text-[10px] uppercase tracking-wide opacity-70">{label}</span>
    </div>
  )
}

export function ConfusionMatrixDisplay({ matrices }: ConfusionMatrixProps) {
  return (
    <Card className="border-border/60">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <Grid3X3 className="h-4 w-4 text-primary" />
          <CardTitle className="text-base">Confusion Matrices</CardTitle>
        </div>
        <CardDescription className="text-xs">
          Classification results from 5-fold cross-validation on holdout test set
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {matrices.map((matrix) => {
            const total = matrix.tp + matrix.fp + matrix.tn + matrix.fn
            const accuracy = ((matrix.tp + matrix.tn) / total * 100).toFixed(1)

            return (
              <div key={matrix.model} className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-semibold text-foreground">{matrix.model}</h4>
                  <span className="text-xs text-muted-foreground font-mono">
                    Acc: {accuracy}%
                  </span>
                </div>

                {/* Axis Labels */}
                <div className="flex flex-col gap-1">
                  <div className="flex items-center justify-center">
                    <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                      Predicted
                    </span>
                  </div>
                  <div className="flex gap-1">
                    <div className="flex w-8 items-center justify-center">
                      <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground [writing-mode:vertical-rl] rotate-180">
                        Actual
                      </span>
                    </div>
                    <div className="flex-1">
                      <div className="mb-1 grid grid-cols-2 gap-1">
                        <span className="text-center text-[10px] text-muted-foreground">Positive</span>
                        <span className="text-center text-[10px] text-muted-foreground">Negative</span>
                      </div>
                      <div className="grid grid-cols-2 gap-1.5">
                        <MatrixCell value={matrix.tp} label="True Pos" type="tp" />
                        <MatrixCell value={matrix.fp} label="False Pos" type="fp" />
                        <MatrixCell value={matrix.fn} label="False Neg" type="fn" />
                        <MatrixCell value={matrix.tn} label="True Neg" type="tn" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Cost calculation */}
                <div className="rounded-lg bg-secondary/50 p-2 text-xs text-muted-foreground">
                  <span className="font-mono">
                    {"Cost = FP * C_fp + FN * C_fn"}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}

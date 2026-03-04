"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { TableIcon } from "lucide-react"
import type { EvaluationMetrics } from "@/lib/prediction-engine"

interface MetricsTableProps {
  metrics: EvaluationMetrics
}

function MetricCell({ value, best }: { value: number; best: boolean }) {
  return (
    <TableCell className="text-center font-mono text-sm">
      <span className={best ? "font-bold text-success" : "text-foreground"}>
        {(value * 100).toFixed(1)}%
      </span>
    </TableCell>
  )
}

export function MetricsTable({ metrics }: MetricsTableProps) {
  const metricNames = ["accuracy", "precision", "recall", "roc_auc", "f1_score"] as const
  const metricLabels: Record<string, string> = {
    accuracy: "Accuracy",
    precision: "Precision",
    recall: "Recall",
    roc_auc: "ROC-AUC",
    f1_score: "F1 Score",
  }

  return (
    <Card className="border-border/60">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <TableIcon className="h-4 w-4 text-primary" />
          <CardTitle className="text-base">Evaluation Metrics Summary</CardTitle>
        </div>
        <CardDescription className="text-xs">
          Model performance metrics from cross-validated evaluation
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[120px]">Metric</TableHead>
              <TableHead className="text-center">Decision Tree</TableHead>
              <TableHead className="text-center">Naive Bayes</TableHead>
              <TableHead className="text-center">K-NN</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {metricNames.map((name) => {
              const dt = metrics.decision_tree[name]
              const nb = metrics.naive_bayes[name]
              const knn = metrics.knn[name]
              const maxVal = Math.max(dt, nb, knn)

              return (
                <TableRow key={name}>
                  <TableCell className="font-medium text-sm">
                    {metricLabels[name]}
                  </TableCell>
                  <MetricCell value={dt} best={dt === maxVal} />
                  <MetricCell value={nb} best={nb === maxVal} />
                  <MetricCell value={knn} best={knn === maxVal} />
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

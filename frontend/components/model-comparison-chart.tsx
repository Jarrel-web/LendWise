"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts"
import type { PredictionResult } from "@/lib/prediction-engine"
import { BarChart3, Radar as RadarIcon } from "lucide-react"

interface ModelComparisonChartProps {
  result: PredictionResult
}

export function ModelComparisonChart({ result }: ModelComparisonChartProps) {
  const probabilityData = result.predictions.map((p) => ({
    name: p.model,
    Risk: Math.round(p.probability_default * 10000) / 100,
    Safe: Math.round(p.probability_non_default * 10000) / 100,
  }))

  const metricsData = [
    {
      metric: "Accuracy",
      "Decision Tree": result.evaluation_metrics.decision_tree.accuracy * 100,
      "Naive Bayes": result.evaluation_metrics.naive_bayes.accuracy * 100,
      "K-NN": result.evaluation_metrics.knn.accuracy * 100,
    },
    {
      metric: "Precision",
      "Decision Tree": result.evaluation_metrics.decision_tree.precision * 100,
      "Naive Bayes": result.evaluation_metrics.naive_bayes.precision * 100,
      "K-NN": result.evaluation_metrics.knn.precision * 100,
    },
    {
      metric: "Recall",
      "Decision Tree": result.evaluation_metrics.decision_tree.recall * 100,
      "Naive Bayes": result.evaluation_metrics.naive_bayes.recall * 100,
      "K-NN": result.evaluation_metrics.knn.recall * 100,
    },
    {
      metric: "ROC-AUC",
      "Decision Tree": result.evaluation_metrics.decision_tree.roc_auc * 100,
      "Naive Bayes": result.evaluation_metrics.naive_bayes.roc_auc * 100,
      "K-NN": result.evaluation_metrics.knn.roc_auc * 100,
    },
    {
      metric: "F1 Score",
      "Decision Tree": result.evaluation_metrics.decision_tree.f1_score * 100,
      "Naive Bayes": result.evaluation_metrics.naive_bayes.f1_score * 100,
      "K-NN": result.evaluation_metrics.knn.f1_score * 100,
    },
  ]

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      {/* Probability Comparison */}
      <Card className="border-border/60">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4 text-primary" />
            <CardTitle className="text-base">Probability Comparison</CardTitle>
          </div>
          <CardDescription className="text-xs">
            Risk and Safe probabilities across all three models
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={probabilityData} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 12 }}
                className="fill-muted-foreground"
              />
              <YAxis
                tick={{ fontSize: 12 }}
                className="fill-muted-foreground"
                domain={[0, 100]}
                tickFormatter={(v) => `${v}%`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--color-card)",
                  border: "1px solid var(--color-border)",
                  borderRadius: "8px",
                  fontSize: "12px",
                }}
                formatter={(value: number) => [`${value.toFixed(2)}%`]}
              />
              <Legend wrapperStyle={{ fontSize: "12px" }} />
              <Bar
                dataKey="Risk"
                fill="oklch(0.55 0.22 25)"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="Safe"
                fill="oklch(0.60 0.16 160)"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Metrics Radar Chart */}
      <Card className="border-border/60">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <RadarIcon className="h-4 w-4 text-primary" />
            <CardTitle className="text-base">Model Evaluation Metrics</CardTitle>
          </div>
          <CardDescription className="text-xs">
            Performance comparison across evaluation criteria
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={260}>
            <RadarChart data={metricsData}>
              <PolarGrid className="stroke-border" />
              <PolarAngleAxis
                dataKey="metric"
                tick={{ fontSize: 11 }}
                className="fill-muted-foreground"
              />
              <PolarRadiusAxis
                angle={90}
                domain={[50, 100]}
                tick={{ fontSize: 10 }}
                className="fill-muted-foreground"
              />
              <Radar
                name="Decision Tree"
                dataKey="Decision Tree"
                stroke="oklch(0.35 0.07 260)"
                fill="oklch(0.35 0.07 260)"
                fillOpacity={0.15}
                strokeWidth={2}
              />
              <Radar
                name="Naive Bayes"
                dataKey="Naive Bayes"
                stroke="oklch(0.60 0.16 160)"
                fill="oklch(0.60 0.16 160)"
                fillOpacity={0.15}
                strokeWidth={2}
              />
              <Radar
                name="K-NN"
                dataKey="K-NN"
                stroke="oklch(0.70 0.18 55)"
                fill="oklch(0.70 0.18 55)"
                fillOpacity={0.15}
                strokeWidth={2}
              />
              <Legend wrapperStyle={{ fontSize: "12px" }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--color-card)",
                  border: "1px solid var(--color-border)",
                  borderRadius: "8px",
                  fontSize: "12px",
                }}
                formatter={(value: number) => [`${value.toFixed(1)}%`]}
              />
            </RadarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}

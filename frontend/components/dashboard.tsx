"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { ApplicantForm } from "@/components/applicant-form"
import { ModelPredictionCard } from "@/components/model-prediction-card"
import { ModelComparisonChart } from "@/components/model-comparison-chart"
import { ConfusionMatrixDisplay } from "@/components/confusion-matrix"
import { DecisionPolicy } from "@/components/decision-policy"
import { MetricsTable } from "@/components/metrics-table"
import {
  AlertTriangle,
  BadgeDollarSign,
  ChartNoAxesCombined,
  CheckCircle2,
  CircleDashed,
  FileBarChart2,
  UserRoundSearch,
} from "lucide-react"
import type { ApplicantInput, PredictionResult } from "@/lib/prediction-engine"

export function Dashboard() {
  const [result, setResult] = useState<PredictionResult | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (data: ApplicantInput) => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const err = await response.json()
        throw new Error(err.error || "Prediction failed")
      }

      const predictionResult = await response.json()
      setResult(predictionResult)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  const summary = result
    ? (() => {
        const avgProb =
          result.predictions.reduce((sum, p) => sum + p.probability_default, 0) /
          result.predictions.length
        const grantVotes = result.predictions.filter((p) => p.decision === "Grant").length
        const denyVotes = result.predictions.length - grantVotes
        const maxProb = Math.max(...result.predictions.map((p) => p.probability_default))
        const minProb = Math.min(...result.predictions.map((p) => p.probability_default))
        return {
          avgProb,
          grantVotes,
          denyVotes,
          spread: maxProb - minProb,
          recommendedAction: result.decision_policy.optimal_action,
        }
      })()
    : null

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-6">
        <section className="grid gap-4 lg:grid-cols-[1.25fr_1fr]">
          <ApplicantForm onSubmit={handleSubmit} isLoading={isLoading} />
          <Card className="border-border/60 bg-gradient-to-br from-card to-secondary/25">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-base">
                <UserRoundSearch className="h-4 w-4 text-primary" />
                Credit Officer Brief
              </CardTitle>
              <CardDescription>
                Fast triage view for manual review and decision escalation.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-3 text-sm">
              <div className="rounded-lg border border-border/60 bg-background/60 p-3">
                <p className="text-xs uppercase tracking-wide text-muted-foreground">
                  Review Priorities
                </p>
                <p className="mt-1 text-foreground">
                  1) Check recommendation and expected loss, 2) compare model vote split, 3) inspect metrics confidence before final approval.
                </p>
              </div>
              <div className="rounded-lg border border-border/60 bg-background/60 p-3">
                <p className="text-xs uppercase tracking-wide text-muted-foreground">
                  Inputs Used
                </p>
                <p className="mt-1 text-foreground">
                  Current project schema only: applicant profile, account status, loan amount, duration, and max acceptable loss.
                </p>
              </div>
              <div className="rounded-lg border border-border/60 bg-background/60 p-3">
                <p className="text-xs uppercase tracking-wide text-muted-foreground">
                  Model Strategy
                </p>
                <p className="mt-1 text-foreground">
                  Multi-model scoring with cost-based policy to produce a single Grant or Deny recommendation.
                </p>
              </div>
            </CardContent>
          </Card>
        </section>

        {error && (
          <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4">
            <p className="text-sm text-destructive">{error}</p>
          </div>
        )}

        {result && summary && (
          <section className="animate-in fade-in-25 flex flex-col gap-6 duration-300">
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <Card className="border-border/60">
                <CardContent className="pt-6">
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">Recommended Action</p>
                  <div className="mt-2 flex items-center gap-2">
                    {summary.recommendedAction === "Grant" ? (
                      <CheckCircle2 className="h-5 w-5 text-success" />
                    ) : (
                      <AlertTriangle className="h-5 w-5 text-destructive" />
                    )}
                    <span className="text-xl font-semibold">{summary.recommendedAction}</span>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-border/60">
                <CardContent className="pt-6">
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">Average Risk</p>
                  <p className="mt-2 text-xl font-semibold">{(summary.avgProb * 100).toFixed(2)}%</p>
                </CardContent>
              </Card>
              <Card className="border-border/60">
                <CardContent className="pt-6">
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">Model Consensus</p>
                  <div className="mt-2 flex items-center gap-2">
                    <Badge variant="outline" className="border-success/30 text-success">Grant {summary.grantVotes}</Badge>
                    <Badge variant="outline" className="border-destructive/30 text-destructive">Deny {summary.denyVotes}</Badge>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-border/60">
                <CardContent className="pt-6">
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">Disagreement Spread</p>
                  <p className="mt-2 text-xl font-semibold">{(summary.spread * 100).toFixed(2)} pts</p>
                </CardContent>
              </Card>
            </div>

            <DecisionPolicy result={result} />

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              {result.predictions.map((prediction) => (
                <ModelPredictionCard key={prediction.model} prediction={prediction} />
              ))}
            </div>

            <Accordion type="multiple" defaultValue={["comparison", "metrics"]} className="rounded-xl border border-border/60 bg-card/50 px-4">
              <AccordionItem value="comparison">
                <AccordionTrigger className="text-sm font-semibold">
                  <span className="flex items-center gap-2">
                    <ChartNoAxesCombined className="h-4 w-4 text-primary" />
                    Model Comparison
                  </span>
                </AccordionTrigger>
                <AccordionContent>
                  <ModelComparisonChart result={result} />
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="metrics">
                <AccordionTrigger className="text-sm font-semibold">
                  <span className="flex items-center gap-2">
                    <FileBarChart2 className="h-4 w-4 text-primary" />
                    Evaluation Metrics Snapshot
                  </span>
                </AccordionTrigger>
                <AccordionContent>
                  <MetricsTable metrics={result.evaluation_metrics} />
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="confusion">
                <AccordionTrigger className="text-sm font-semibold">
                  <span className="flex items-center gap-2">
                    <CircleDashed className="h-4 w-4 text-primary" />
                    Confusion Matrices
                  </span>
                </AccordionTrigger>
                <AccordionContent>
                  <ConfusionMatrixDisplay matrices={result.confusion_matrices} />
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </section>
        )}

        {!result && !error && !isLoading && (
          <Card className="overflow-hidden border-dashed border-border/70 bg-gradient-to-br from-card via-card to-secondary/40">
            <CardContent className="flex flex-col items-center justify-center px-6 py-16 text-center">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/12">
                <BadgeDollarSign className="h-7 w-7 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">Case Workspace Ready</h3>
              <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground">
                Submit applicant details to generate a decision brief with model consensus, expected loss analysis, and supporting evaluation evidence for credit review.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

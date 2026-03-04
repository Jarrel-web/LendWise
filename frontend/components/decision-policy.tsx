"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ShieldCheck, ShieldX, ArrowRight, Scale, AlertTriangle } from "lucide-react"
import type { PredictionResult } from "@/lib/prediction-engine"

interface DecisionPolicyProps {
  result: PredictionResult
}

export function DecisionPolicy({ result }: DecisionPolicyProps) {
  const { decision_policy, predictions } = result
  const normalizedAction = String(decision_policy.optimal_action ?? "").toLowerCase()
  const isGranted = normalizedAction === "grant" || normalizedAction === "approve"
  const decisionLabel = isGranted ? "LOAN GRANTED" : "LOAN DENIED"
  const policyProb =
    typeof decision_policy.policy_probability_default === "number"
      ? decision_policy.policy_probability_default
      : predictions.reduce((sum, p) => sum + p.probability_default, 0) / predictions.length

  return (
    <Card
      className={`border-2 ${
        isGranted ? "border-success/30 bg-success/5" : "border-destructive/30 bg-destructive/5"
      }`}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                isGranted
                  ? "bg-success/15 text-success"
                  : "bg-destructive/15 text-destructive"
              }`}
            >
              {isGranted ? (
                <ShieldCheck className="h-5 w-5" />
              ) : (
                <ShieldX className="h-5 w-5" />
              )}
            </div>
            <div>
              <CardTitle className="text-lg">Decision Policy Output</CardTitle>
              <CardDescription className="text-xs">
                Risk-aware lending decision based on expected cost analysis
              </CardDescription>
            </div>
          </div>
          <Badge
            variant={isGranted ? "outline" : "destructive"}
            className={`text-sm px-3 py-1 ${
              isGranted
                ? "bg-success text-success-foreground border-success/30 hover:bg-success"
                : "hover:bg-destructive/90"
            }`}
          >
            {decisionLabel}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-5">
        {/* Formula Explanation */}
        <div className="rounded-lg bg-card p-4 border border-border/60">
          <div className="flex items-center gap-2 mb-3">
            <Scale className="h-4 w-4 text-primary" />
            <h4 className="text-sm font-semibold text-foreground">Expected Risk Computation</h4>
          </div>
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3 text-sm">
              <div className="flex-1 rounded-lg bg-destructive/10 p-3 border border-destructive/20">
                <p className="text-[10px] uppercase tracking-wide text-muted-foreground mb-1">
                  Cost(grant)
                </p>
                <p className="font-mono text-sm text-foreground">
                  Risk x C_default
                </p>
                <p className="font-mono text-xs text-muted-foreground mt-1">
                  = {policyProb.toFixed(4)} x {result.applicant.Credit_amount}
                </p>
                <p className="font-mono text-base font-bold text-destructive mt-1">
                  = {decision_policy.cost_grant.toFixed(2)} DM
                </p>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0" />
              <div className="flex-1 rounded-lg bg-warning/10 p-3 border border-warning/20">
                <p className="text-[10px] uppercase tracking-wide text-muted-foreground mb-1">
                  Cost(deny)
                </p>
                <p className="font-mono text-sm text-foreground">
                  Safe x C_lost
                </p>
                <p className="font-mono text-xs text-muted-foreground mt-1">
                  = {(1 - policyProb).toFixed(4)} x {(result.applicant.Credit_amount * 0.15).toFixed(0)}
                </p>
                <p className="font-mono text-base font-bold text-warning-foreground mt-1">
                  = {decision_policy.cost_deny.toFixed(2)} DM
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Summary Metrics */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-lg bg-card p-3 border border-border/60 text-center">
            <p className="text-[10px] uppercase tracking-wide text-muted-foreground">
              Policy Risk
            </p>
            <p className="font-mono text-lg font-bold text-foreground">
              {(policyProb * 100).toFixed(2)}%
            </p>
          </div>
          <div className="rounded-lg bg-card p-3 border border-border/60 text-center">
            <p className="text-[10px] uppercase tracking-wide text-muted-foreground">
              Expected Loss (Grant)
            </p>
            <p className="font-mono text-lg font-bold text-destructive">
              {decision_policy.expected_loss_grant.toFixed(0)} DM
            </p>
          </div>
          <div className="rounded-lg bg-card p-3 border border-border/60 text-center">
            <p className="text-[10px] uppercase tracking-wide text-muted-foreground">
              Expected Loss (Deny)
            </p>
            <p className="font-mono text-lg font-bold text-warning-foreground">
              {decision_policy.expected_loss_deny.toFixed(0)} DM
            </p>
          </div>
          <div className="rounded-lg bg-card p-3 border border-border/60 text-center">
            <p className="text-[10px] uppercase tracking-wide text-muted-foreground">
              Max Acceptable Loss
            </p>
            <p className="font-mono text-lg font-bold text-foreground">
              {result.applicant.max_acceptable_loss.toLocaleString()} DM
            </p>
          </div>
        </div>

        {/* Reasoning */}
        <div className="rounded-lg bg-secondary/50 p-3">
          <p className="text-xs leading-relaxed text-muted-foreground">
            <span className="font-semibold text-foreground">Decision rationale: </span>
            {isGranted ? (
              <>
                The expected loss from granting the loan ({decision_policy.cost_grant.toFixed(2)} DM)
                is below the maximum acceptable loss threshold ({result.applicant.max_acceptable_loss.toLocaleString()} DM)
                and is {decision_policy.cost_grant < decision_policy.cost_deny ? "lower" : "higher"} than
                the opportunity cost of denial ({decision_policy.cost_deny.toFixed(2)} DM). The system
                recommends <strong>approving</strong> this loan application.
              </>
            ) : (
              <>
                The expected loss from granting the loan ({decision_policy.cost_grant.toFixed(2)} DM)
                exceeds the maximum acceptable loss threshold ({result.applicant.max_acceptable_loss.toLocaleString()} DM)
                or is higher than the opportunity cost of denial ({decision_policy.cost_deny.toFixed(2)} DM). The system
                recommends <strong>denying</strong> this loan application.
              </>
            )}
          </p>
        </div>

        {decision_policy.review_flag && (
          <div className="rounded-lg border border-warning/30 bg-warning/10 p-3">
            <p className="flex items-center gap-2 text-xs font-semibold text-warning-foreground">
              <AlertTriangle className="h-3.5 w-3.5" />
              Manual Review Recommended
            </p>
            <ul className="mt-2 list-disc pl-5 text-xs text-muted-foreground">
              {decision_policy.review_reasons.map((reason) => (
                <li key={reason}>{reason}</li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

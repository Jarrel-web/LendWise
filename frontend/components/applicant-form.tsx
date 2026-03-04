"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { User, Briefcase, Home, PiggyBank, CreditCard, Clock, Target, DollarSign, ShieldAlert } from "lucide-react"
import type { ApplicantInput } from "@/lib/prediction-engine"

interface ApplicantFormProps {
  onSubmit: (data: ApplicantInput) => void
  isLoading: boolean
}

export function ApplicantForm({ onSubmit, isLoading }: ApplicantFormProps) {
  const [formData, setFormData] = useState<ApplicantInput>({
    Age: 45,
    Sex: "male",
    Job: 2,
    Housing: "own",
    Saving_accounts: "moderate",
    Checking_account: "moderate",
    Credit_amount: 1500,
    Duration: 12,
    Purpose: "radio/TV",
    max_acceptable_loss: 2000,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  const updateField = <K extends keyof ApplicantInput>(
    field: K,
    value: ApplicantInput[K]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <Card className="border-border/60">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <User className="h-5 w-5 text-primary" />
          </div>
          <div>
            <CardTitle className="text-lg">Applicant Information</CardTitle>
            <CardDescription>
              Enter loan applicant details for risk assessment
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {/* Personal Information */}
          <div className="flex flex-col gap-1.5">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Personal Details
            </p>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              {/* Age */}
              <div className="flex flex-col gap-2">
                <Label htmlFor="age" className="flex items-center gap-1.5 text-sm font-medium">
                  <User className="h-3.5 w-3.5 text-muted-foreground" />
                  Age
                </Label>
                <Input
                  id="age"
                  type="number"
                  min={18}
                  max={100}
                  value={formData.Age}
                  onChange={(e) => updateField("Age", parseInt(e.target.value) || 18)}
                  className="h-9"
                />
              </div>

              {/* Sex */}
              <div className="flex flex-col gap-2">
                <Label htmlFor="sex" className="flex items-center gap-1.5 text-sm font-medium">
                  <User className="h-3.5 w-3.5 text-muted-foreground" />
                  Sex
                </Label>
                <Select
                  value={formData.Sex}
                  onValueChange={(value) => updateField("Sex", value)}
                >
                  <SelectTrigger id="sex" className="h-9 w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Job */}
              <div className="flex flex-col gap-2">
                <Label htmlFor="job" className="flex items-center gap-1.5 text-sm font-medium">
                  <Briefcase className="h-3.5 w-3.5 text-muted-foreground" />
                  Job Level
                </Label>
                <Select
                  value={String(formData.Job)}
                  onValueChange={(value) => updateField("Job", parseInt(value))}
                >
                  <SelectTrigger id="job" className="h-9 w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">0 - Unskilled (Non-resident)</SelectItem>
                    <SelectItem value="1">1 - Unskilled (Resident)</SelectItem>
                    <SelectItem value="2">2 - Skilled</SelectItem>
                    <SelectItem value="3">3 - Highly Skilled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Housing & Financial */}
          <div className="flex flex-col gap-1.5">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Financial Profile
            </p>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              {/* Housing */}
              <div className="flex flex-col gap-2">
                <Label htmlFor="housing" className="flex items-center gap-1.5 text-sm font-medium">
                  <Home className="h-3.5 w-3.5 text-muted-foreground" />
                  Housing
                </Label>
                <Select
                  value={formData.Housing}
                  onValueChange={(value) => updateField("Housing", value)}
                >
                  <SelectTrigger id="housing" className="h-9 w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="own">Own</SelectItem>
                    <SelectItem value="rent">Rent</SelectItem>
                    <SelectItem value="free">Free</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Saving Accounts */}
              <div className="flex flex-col gap-2">
                <Label htmlFor="savings" className="flex items-center gap-1.5 text-sm font-medium">
                  <PiggyBank className="h-3.5 w-3.5 text-muted-foreground" />
                  Saving Accounts
                </Label>
                <Select
                  value={formData.Saving_accounts}
                  onValueChange={(value) => updateField("Saving_accounts", value)}
                >
                  <SelectTrigger id="savings" className="h-9 w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="little">Little</SelectItem>
                    <SelectItem value="moderate">Moderate</SelectItem>
                    <SelectItem value="quite rich">Quite Rich</SelectItem>
                    <SelectItem value="rich">Rich</SelectItem>
                    <SelectItem value="na">N/A</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Checking Account */}
              <div className="flex flex-col gap-2">
                <Label htmlFor="checking" className="flex items-center gap-1.5 text-sm font-medium">
                  <CreditCard className="h-3.5 w-3.5 text-muted-foreground" />
                  Checking Account
                </Label>
                <Select
                  value={formData.Checking_account}
                  onValueChange={(value) => updateField("Checking_account", value)}
                >
                  <SelectTrigger id="checking" className="h-9 w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="little">Little</SelectItem>
                    <SelectItem value="moderate">Moderate</SelectItem>
                    <SelectItem value="rich">Rich</SelectItem>
                    <SelectItem value="na">N/A</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Loan Details */}
          <div className="flex flex-col gap-1.5">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Loan Details
            </p>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              {/* Credit Amount */}
              <div className="flex flex-col gap-2">
                <Label htmlFor="credit" className="flex items-center gap-1.5 text-sm font-medium">
                  <DollarSign className="h-3.5 w-3.5 text-muted-foreground" />
                  Credit Amount (DM)
                </Label>
                <Input
                  id="credit"
                  type="number"
                  min={100}
                  max={50000}
                  value={formData.Credit_amount}
                  onChange={(e) => updateField("Credit_amount", parseInt(e.target.value) || 100)}
                  className="h-9"
                />
              </div>

              {/* Duration */}
              <div className="flex flex-col gap-2">
                <Label htmlFor="duration" className="flex items-center gap-1.5 text-sm font-medium">
                  <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                  Duration (months)
                </Label>
                <Input
                  id="duration"
                  type="number"
                  min={1}
                  max={72}
                  value={formData.Duration}
                  onChange={(e) => updateField("Duration", parseInt(e.target.value) || 1)}
                  className="h-9"
                />
              </div>

              {/* Purpose */}
              <div className="flex flex-col gap-2">
                <Label htmlFor="purpose" className="flex items-center gap-1.5 text-sm font-medium">
                  <Target className="h-3.5 w-3.5 text-muted-foreground" />
                  Purpose
                </Label>
                <Select
                  value={formData.Purpose}
                  onValueChange={(value) => updateField("Purpose", value)}
                >
                  <SelectTrigger id="purpose" className="h-9 w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="car">Car</SelectItem>
                    <SelectItem value="furniture/equipment">Furniture / Equipment</SelectItem>
                    <SelectItem value="radio/TV">Radio / TV</SelectItem>
                    <SelectItem value="domestic appliances">Domestic Appliances</SelectItem>
                    <SelectItem value="repairs">Repairs</SelectItem>
                    <SelectItem value="education">Education</SelectItem>
                    <SelectItem value="business">Business</SelectItem>
                    <SelectItem value="vacation/others">Vacation / Others</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Risk Tolerance */}
          <div className="flex flex-col gap-1.5">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Risk Tolerance
            </p>
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="loss" className="flex items-center gap-1.5 text-sm font-medium">
                  <ShieldAlert className="h-3.5 w-3.5 text-muted-foreground" />
                  Max Acceptable Loss (DM)
                </Label>
                <span className="rounded-md bg-secondary px-2.5 py-0.5 text-sm font-mono font-semibold text-secondary-foreground">
                  {formData.max_acceptable_loss.toLocaleString()}
                </span>
              </div>
              <Slider
                id="loss"
                min={100}
                max={20000}
                step={100}
                value={[formData.max_acceptable_loss]}
                onValueChange={([value]) => updateField("max_acceptable_loss", value)}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>100 DM (Conservative)</span>
                <span>20,000 DM (Aggressive)</span>
              </div>
            </div>
          </div>

          <Button
            type="submit"
            size="lg"
            disabled={isLoading}
            className="w-full mt-1 bg-primary text-primary-foreground hover:bg-primary/90"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                Analyzing Risk...
              </span>
            ) : (
              "Run Risk Assessment"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

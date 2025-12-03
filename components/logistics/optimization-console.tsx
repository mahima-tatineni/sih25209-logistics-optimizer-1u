"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Zap } from "lucide-react"

export function OptimizationConsole() {
  const [selectedSchedule, setSelectedSchedule] = useState("SCH001")
  const [optimizationMode, setOptimizationMode] = useState("quick")
  const [isOptimizing, setIsOptimizing] = useState(false)
  const [optimizationProgress, setOptimizationProgress] = useState(0)

  const handleOptimize = () => {
    setIsOptimizing(true)
    setOptimizationProgress(0)
    const interval = setInterval(() => {
      setOptimizationProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsOptimizing(false)
          return 100
        }
        return prev + Math.random() * 40
      })
    }, 500)
  }

  return (
    <div className="space-y-6">
      {/* Schedule Selection */}
      <Card className="border-2 border-primary/20">
        <CardHeader>
          <CardTitle className="text-primary">Select Schedule for Optimization</CardTitle>
          <CardDescription>Choose a draft schedule to optimize</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { id: "SCH001", vessel: "MV Pacific Glory", origin: "Gladstone", qty: "75,000t", status: "Draft" },
              { id: "SCH002", vessel: "MV Ocean Star", origin: "Newcastle", qty: "72,000t", status: "Draft" },
            ].map((sch) => (
              <div
                key={sch.id}
                onClick={() => setSelectedSchedule(sch.id)}
                className={`p-4 rounded-lg border-2 cursor-pointer transition ${
                  selectedSchedule === sch.id
                    ? "border-accent bg-accent/5"
                    : "border-primary/10 hover:border-primary/30"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-semibold text-primary">{sch.vessel}</p>
                    <p className="text-sm text-muted-foreground">From {sch.origin}</p>
                    <p className="font-bold text-primary mt-1">{sch.qty}</p>
                  </div>
                  <Badge variant="secondary">{sch.status}</Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Optimization Settings */}
      <Card className="border-2 border-primary/20">
        <CardHeader>
          <CardTitle className="text-primary">Optimization Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Optimization Mode</Label>
            <Select value={optimizationMode} onValueChange={setOptimizationMode}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="quick">Quick (Heuristic) - 2-5 min</SelectItem>
                <SelectItem value="detailed">Detailed (MILP) - 10-15 min</SelectItem>
                <SelectItem value="whatif">What-If Scenario - Custom params</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {optimizationMode === "whatif" && (
            <div className="space-y-3 p-4 bg-secondary/10 rounded">
              <div>
                <Label htmlFor="fx">FX Rate (USD/INR)</Label>
                <Input id="fx" type="number" defaultValue="83.5" />
              </div>
              <div>
                <Label htmlFor="demurrage">Demurrage Rate (USD/day)</Label>
                <Input id="demurrage" type="number" defaultValue="5000" />
              </div>
              <div>
                <Label htmlFor="target">Target Stock Days</Label>
                <Input id="target" type="number" defaultValue="30" />
              </div>
            </div>
          )}

          <Button className="w-full bg-accent hover:bg-accent/90" onClick={handleOptimize} disabled={isOptimizing}>
            <Zap className="h-4 w-4 mr-2" />
            {isOptimizing ? "Optimizing..." : "Run Optimization"}
          </Button>
        </CardContent>
      </Card>

      {/* Optimization Progress */}
      {isOptimizing && (
        <Card className="border-2 border-accent/20 bg-accent/5">
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="font-semibold text-primary">Optimization in Progress</p>
                  <p className="text-sm text-muted-foreground">{Math.round(optimizationProgress)}%</p>
                </div>
                <Progress value={optimizationProgress} className="h-2" />
              </div>
              <p className="text-sm text-muted-foreground">
                Running {optimizationMode === "quick" ? "quick heuristic" : "detailed MILP"} optimization...
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Optimization Results */}
      {optimizationProgress === 100 && !isOptimizing && (
        <Card className="border-2 border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="text-green-900">Optimization Complete</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-3 bg-white rounded border border-green-200">
                <p className="text-xs text-muted-foreground">All-in Cost</p>
                <p className="font-bold text-primary">$82.5/t</p>
                <p className="text-xs text-green-600">-2.8% vs baseline</p>
              </div>
              <div className="p-3 bg-white rounded border border-green-200">
                <p className="text-xs text-muted-foreground">Discharge Port</p>
                <p className="font-bold text-primary">Vizag</p>
                <p className="text-xs text-muted-foreground">ETA: 2025-02-08</p>
              </div>
              <div className="p-3 bg-white rounded border border-green-200">
                <p className="text-xs text-muted-foreground">Rail Allocation</p>
                <p className="font-bold text-primary">BSP: 40kt</p>
                <p className="text-xs text-muted-foreground">RSP: 35kt</p>
              </div>
              <div className="p-3 bg-white rounded border border-green-200">
                <p className="text-xs text-muted-foreground">Expected Demurrage</p>
                <p className="font-bold text-primary">$18.5k</p>
                <p className="text-xs text-green-600">Low risk</p>
              </div>
            </div>

            <div className="p-4 bg-white rounded border border-green-200">
              <p className="font-semibold text-primary mb-3">Recommended Route</p>
              <p className="text-sm text-muted-foreground mb-2">
                Gladstone → Vizag (Ocean: $65/t) → BSP via Rail (Rail: $17.5/t)
              </p>
              <p className="text-sm text-muted-foreground">
                Alternative: Vizag → Vizag Port (Port Ops: $8.5/t, Demurrage: $2/t)
              </p>
            </div>

            <div className="flex gap-3">
              <Button className="flex-1 bg-accent hover:bg-accent/90">Accept & Lock Plan</Button>
              <Button variant="outline" className="flex-1 bg-transparent">
                View Alternative Routes
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

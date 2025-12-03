"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

export function PlantScheduleTracking() {
  const schedules = [
    {
      id: "SCH001",
      vessel: "MV Pacific Glory",
      origin: "Gladstone",
      port: "Vizag",
      material: "Coking Coal",
      quantity: "75,000",
      eta: "2025-02-05",
      linkedRequest: "SR001",
      status: "In Transit",
      progress: 60,
      milestones: [
        { name: "Sailed", completed: true, date: "2025-01-10" },
        { name: "At Roadstead", completed: true, date: "2025-01-25" },
        { name: "Berthed", completed: false, date: "Expected 2025-01-28" },
        { name: "Discharge", completed: false, date: "Expected 2025-02-02" },
        { name: "Rail Dispatch", completed: false, date: "Expected 2025-02-05" },
      ],
    },
    {
      id: "SCH002",
      vessel: "Rail Rake #R-2401",
      origin: "Paradip Port",
      port: "Local",
      material: "Coking Coal",
      quantity: "4,000",
      eta: "2025-01-08",
      linkedRequest: "SR003",
      status: "In Transit",
      progress: 85,
      milestones: [
        { name: "Dispatched", completed: true, date: "2025-01-06" },
        { name: "In Transit", completed: true, date: "2025-01-07" },
        { name: "Expected Arrival", completed: false, date: "2025-01-08" },
        { name: "Stock Updated", completed: false, date: "Expected 2025-01-08" },
      ],
    },
    {
      id: "SCH003",
      vessel: "MV Ocean Giant",
      origin: "Richards Bay",
      port: "Haldia",
      material: "Limestone",
      quantity: "35,000",
      eta: "2025-02-10",
      linkedRequest: "SR002",
      status: "Planned",
      progress: 15,
      milestones: [
        { name: "Booking", completed: true, date: "2024-12-20" },
        { name: "Sail", completed: false, date: "Expected 2025-01-15" },
        { name: "At Port", completed: false, date: "Expected 2025-02-08" },
        { name: "Discharge", completed: false, date: "Expected 2025-02-12" },
      ],
    },
  ]

  return (
    <div className="space-y-4">
      {schedules.map((schedule) => (
        <Card key={schedule.id} className="border-2 border-primary/20">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-primary">{schedule.vessel}</CardTitle>
                <CardDescription>
                  {schedule.material} from {schedule.origin} → {schedule.port}
                </CardDescription>
              </div>
              <Badge
                variant={
                  schedule.status === "In Transit" ? "default" : schedule.status === "Planned" ? "secondary" : "outline"
                }
              >
                {schedule.status}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Schedule Details */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Quantity</p>
                <p className="font-bold text-primary">{schedule.quantity} t</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Expected Arrival</p>
                <p className="font-bold text-primary">{schedule.eta}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Linked Request</p>
                <p className="font-bold text-primary">{schedule.linkedRequest}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                <p className="font-bold text-primary">{schedule.status}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Progress</p>
                <p className="font-bold text-primary">{schedule.progress}%</p>
              </div>
            </div>

            {/* Progress Bar */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-semibold text-primary">Overall Progress</p>
                <p className="text-xs text-muted-foreground">{schedule.progress}% complete</p>
              </div>
              <Progress value={schedule.progress} className="h-2" />
            </div>

            {/* Milestones */}
            <div>
              <p className="text-sm font-semibold text-primary mb-3">Journey Milestones</p>
              <div className="space-y-2">
                {schedule.milestones.map((milestone, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <div
                      className={`h-4 w-4 rounded-full border-2 flex-shrink-0 ${
                        milestone.completed ? "bg-green-500 border-green-500" : "border-primary/30 bg-white"
                      }`}
                    />
                    <div className="flex-1">
                      <p className="text-sm font-medium">{milestone.name}</p>
                      <p className="text-xs text-muted-foreground">{milestone.date}</p>
                    </div>
                    {milestone.completed && (
                      <Badge variant="outline" className="text-green-600 border-green-600">
                        Completed
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

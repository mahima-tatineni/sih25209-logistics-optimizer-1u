"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Plus, Pencil, Trash2, Ship, Send, Brain, Filter } from "lucide-react"
import { SUPPLIER_PORTS, VESSELS, PORTS } from "@/lib/mock-data"
import type { Shipment } from "@/lib/types"

export default function STEMPage() {
  const [shipments, setShipments] = useState<Shipment[]>([])
  const [open, setOpen] = useState(false)
  const [editingShipment, setEditingShipment] = useState<Shipment | null>(null)
  const [filterMonth, setFilterMonth] = useState<string>("")
  const [filterVessel, setFilterVessel] = useState<string>("")

  useEffect(() => {
    loadShipments()
  }, [])

  const loadShipments = async () => {
    const res = await fetch("/api/shipments")
    const data = await res.json()
    setShipments(data)
  }

  const handleDelete = async (id: string) => {
    if (confirm("Delete this shipment?")) {
      await fetch(`/api/shipments/${id}`, { method: "DELETE" })
      loadShipments()
    }
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    const form = e.target as HTMLFormElement
    const formData = new FormData(form)

    const shipment: Partial<Shipment> = {
      supplier_port: formData.get("supplier_port") as string,
      vessel: formData.get("vessel") as string,
      material: formData.get("material") as "coking_coal" | "limestone",
      grade: formData.get("grade") as string,
      laycan_start: formData.get("laycan_start") as string,
      laycan_end: formData.get("laycan_end") as string,
      sail_date: formData.get("sail_date") as string,
      quantity_t: Number(formData.get("quantity_t")),
      incoterm: formData.get("incoterm") as string,
      candidate_ports: (formData.get("candidate_ports") as string).split(",").map((p) => p.trim()),
      status: "planned",
    }

    if (editingShipment) {
      await fetch(`/api/shipments/${editingShipment.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(shipment),
      })
    } else {
      await fetch("/api/shipments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...shipment, id: `SHP${Date.now()}` }),
      })
    }

    setOpen(false)
    setEditingShipment(null)
    loadShipments()
  }

  const filteredShipments = shipments.filter((s) => {
    if (filterMonth && !s.sail_date?.startsWith(filterMonth)) return false
    if (filterVessel && s.vessel !== filterVessel) return false
    return true
  })

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#004f6e] mb-2">STEM / Voyage Planning</h1>
          <p className="text-muted-foreground">Single source of truth for shipment and vessel data</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button
              className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 shadow-lg"
              onClick={() => setEditingShipment(null)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Shipment
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-xl">{editingShipment ? "Edit" : "Create"} Shipment / STEM</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSave} className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="supplier_port">Supplier Port *</Label>
                  <Select name="supplier_port" defaultValue={editingShipment?.supplier_port} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select supplier port" />
                    </SelectTrigger>
                    <SelectContent>
                      {SUPPLIER_PORTS.map((p) => (
                        <SelectItem key={p.code} value={p.code}>
                          {p.name} ({p.country})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="vessel">Vessel *</Label>
                  <Select name="vessel" defaultValue={editingShipment?.vessel} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select vessel" />
                    </SelectTrigger>
                    <SelectContent>
                      {VESSELS.map((v) => (
                        <SelectItem key={v.name} value={v.name}>
                          {v.name} ({v.capacity_t / 1000}k MT capacity)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="material">Material *</Label>
                  <Select name="material" defaultValue={editingShipment?.material || "coking_coal"} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select material" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="coking_coal">Coking Coal</SelectItem>
                      <SelectItem value="limestone">Limestone</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="grade">Quality Grade *</Label>
                  <Input
                    id="grade"
                    name="grade"
                    defaultValue={editingShipment?.grade}
                    placeholder="e.g., Premium Hard Coking"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="laycan_start">Laycan Start *</Label>
                  <Input
                    id="laycan_start"
                    name="laycan_start"
                    type="date"
                    defaultValue={editingShipment?.laycan_start}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="laycan_end">Laycan End *</Label>
                  <Input
                    id="laycan_end"
                    name="laycan_end"
                    type="date"
                    defaultValue={editingShipment?.laycan_end}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sail_date">Sail Date *</Label>
                  <Input
                    id="sail_date"
                    name="sail_date"
                    type="date"
                    defaultValue={editingShipment?.sail_date}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="quantity_t">Quantity (tons) *</Label>
                  <Input
                    id="quantity_t"
                    name="quantity_t"
                    type="number"
                    defaultValue={editingShipment?.quantity_t}
                    placeholder="e.g., 75000"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="incoterm">Incoterm *</Label>
                  <Select name="incoterm" defaultValue={editingShipment?.incoterm || "CFR"} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="CFR">CFR</SelectItem>
                      <SelectItem value="FOB">FOB</SelectItem>
                      <SelectItem value="CIF">CIF</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2 col-span-2">
                  <Label htmlFor="candidate_ports">Candidate Indian Ports (comma separated) *</Label>
                  <Input
                    id="candidate_ports"
                    name="candidate_ports"
                    defaultValue={editingShipment?.candidate_ports.join(", ") || ""}
                    placeholder="e.g., VIZAG, PARA, DHAM"
                    required
                  />
                  <p className="text-xs text-muted-foreground">Available: {PORTS.map((p) => p.code).join(", ")}</p>
                </div>
              </div>

              <div className="flex gap-3 justify-end pt-4 border-t">
                <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
                >
                  {editingShipment ? "Update" : "Create"} Shipment
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Filter className="h-5 w-5 text-blue-600" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <div className="space-y-2 flex-1 min-w-[200px]">
              <Label htmlFor="filterMonth">Filter by Month</Label>
              <Input
                id="filterMonth"
                type="month"
                value={filterMonth}
                onChange={(e) => setFilterMonth(e.target.value)}
                placeholder="Select month"
              />
            </div>
            <div className="space-y-2 flex-1 min-w-[200px]">
              <Label htmlFor="filterVessel">Filter by Vessel</Label>
              <Select value={filterVessel} onValueChange={setFilterVessel}>
                <SelectTrigger id="filterVessel">
                  <SelectValue placeholder="All vessels" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All vessels</SelectItem>
                  {VESSELS.map((v) => (
                    <SelectItem key={v.name} value={v.name}>
                      {v.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button
                variant="outline"
                onClick={() => {
                  setFilterMonth("")
                  setFilterVessel("")
                }}
              >
                Clear Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Shipments Table */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Ship className="h-5 w-5 text-orange-500" />
            Shipments & Voyages ({filteredShipments.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredShipments.length > 0 ? (
            <div className="space-y-3">
              {filteredShipments.map((shipment) => (
                <div
                  key={shipment.id}
                  className="flex items-center gap-4 p-4 bg-gradient-to-r from-blue-50 to-slate-50 rounded-lg border border-blue-100 hover:shadow-md transition-shadow"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <p className="font-semibold text-lg text-[#004f6e]">{shipment.vessel}</p>
                      <Badge variant={shipment.status === "in_transit" ? "default" : "secondary"}>
                        {shipment.status.replace("_", " ")}
                      </Badge>
                      {shipment.eta && (
                        <Badge variant="outline" className="text-xs">
                          ETA: {shipment.eta}
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mb-1">
                      <strong>Route:</strong> {shipment.supplier_port} → {shipment.candidate_ports.join(" / ")}
                    </p>
                    <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                      <span className="capitalize">
                        <strong>Material:</strong> {shipment.material.replace("_", " ")}
                      </span>
                      <span>
                        <strong>Grade:</strong> {shipment.grade}
                      </span>
                      <span>
                        <strong>Quantity:</strong> {(shipment.quantity_t / 1000).toFixed(1)}k MT
                      </span>
                      <span>
                        <strong>Sail Date:</strong> {shipment.sail_date}
                      </span>
                      <span>
                        <strong>Incoterm:</strong> {shipment.incoterm}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Button size="sm" variant="outline" className="text-xs bg-transparent">
                      <Send className="h-3 w-3 mr-1" />
                      Send to Optimization
                    </Button>
                    <Button size="sm" variant="outline" className="text-xs bg-transparent">
                      <Brain className="h-3 w-3 mr-1" />
                      Predict Delay
                    </Button>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => {
                        setEditingShipment(shipment)
                        setOpen(true)
                      }}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="ghost" onClick={() => handleDelete(shipment.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <Ship className="h-12 w-12 mx-auto mb-3 opacity-30" />
              <p>No shipments found. Create your first shipment to get started.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

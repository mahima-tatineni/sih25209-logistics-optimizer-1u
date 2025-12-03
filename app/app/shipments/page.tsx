"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Plus, Pencil, Trash2, Ship } from "lucide-react"
import { SUPPLIER_PORTS, VESSELS } from "@/lib/mock-data"
import type { Shipment } from "@/lib/types"

export default function ShipmentsPage() {
  const [shipments, setShipments] = useState<Shipment[]>([])
  const [open, setOpen] = useState(false)
  const [editingShipment, setEditingShipment] = useState<Shipment | null>(null)

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
      candidate_ports: (formData.get("candidate_ports") as string).split(","),
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary mb-2">Shipments</h1>
          <p className="text-muted-foreground">Manage vessel shipments and cargo</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-accent hover:bg-accent/90" onClick={() => setEditingShipment(null)}>
              <Plus className="h-4 w-4 mr-2" />
              New Shipment
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingShipment ? "Edit" : "Create"} Shipment</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="supplier_port">Supplier Port</Label>
                  <Select name="supplier_port" defaultValue={editingShipment?.supplier_port} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select port" />
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
                  <Label htmlFor="vessel">Vessel</Label>
                  <Select name="vessel" defaultValue={editingShipment?.vessel} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select vessel" />
                    </SelectTrigger>
                    <SelectContent>
                      {VESSELS.map((v) => (
                        <SelectItem key={v.name} value={v.name}>
                          {v.name} ({v.capacity_t / 1000}k)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="material">Material</Label>
                  <Select name="material" defaultValue={editingShipment?.material} required>
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
                  <Label htmlFor="grade">Grade</Label>
                  <Input
                    id="grade"
                    name="grade"
                    defaultValue={editingShipment?.grade}
                    placeholder="e.g., Premium Hard Coking"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="laycan_start">Laycan Start</Label>
                  <Input
                    id="laycan_start"
                    name="laycan_start"
                    type="date"
                    defaultValue={editingShipment?.laycan_start}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="laycan_end">Laycan End</Label>
                  <Input
                    id="laycan_end"
                    name="laycan_end"
                    type="date"
                    defaultValue={editingShipment?.laycan_end}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sail_date">Sail Date</Label>
                  <Input
                    id="sail_date"
                    name="sail_date"
                    type="date"
                    defaultValue={editingShipment?.sail_date}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="quantity_t">Quantity (tons)</Label>
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
                  <Label htmlFor="incoterm">Incoterm</Label>
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

                <div className="space-y-2">
                  <Label htmlFor="candidate_ports">Candidate Ports (comma separated)</Label>
                  <Input
                    id="candidate_ports"
                    name="candidate_ports"
                    defaultValue={editingShipment?.candidate_ports.join(",")}
                    placeholder="e.g., VIZAG,PARA,DHAM"
                    required
                  />
                </div>
              </div>

              <div className="flex gap-2 justify-end">
                <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" className="bg-accent hover:bg-accent/90">
                  {editingShipment ? "Update" : "Create"} Shipment
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Ship className="h-5 w-5 text-accent" />
            All Shipments
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {shipments.map((shipment) => (
              <div key={shipment.id} className="flex items-center gap-4 p-4 bg-muted rounded-lg">
                <div className="flex-1">
                  <p className="font-semibold">{shipment.vessel}</p>
                  <p className="text-sm text-muted-foreground">
                    {shipment.supplier_port} → {shipment.candidate_ports.join(", ")}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {shipment.material.replace("_", " ")} • {(shipment.quantity_t / 1000).toFixed(0)}k tons • Sail:{" "}
                    {shipment.sail_date}
                  </p>
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
        </CardContent>
      </Card>
    </div>
  )
}

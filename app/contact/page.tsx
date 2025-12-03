"use client"

import type React from "react"

import { useState } from "react"
import { PublicNav } from "@/components/public-nav"
import { PublicFooter } from "@/components/public-footer"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Mail, Phone, MapPin, Building2 } from "lucide-react"

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 3000)
  }

  return (
    <div className="min-h-screen flex flex-col">
      <PublicNav />

      <main className="flex-1">
        <section className="bg-gradient-to-br from-[#004f6e] via-[#00425c] to-[#003547] text-white py-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-balance">Contact SAIL Logistics</h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto text-pretty leading-relaxed">
              Get in touch with our team for inquiries about the SAIL PortLink AI platform
            </p>
          </div>
        </section>

        <section className="py-16 container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <Card className="border-2 border-primary/20 hover:border-accent transition-colors">
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center text-center">
                    <div className="h-12 w-12 rounded-full bg-accent/10 flex items-center justify-center mb-4">
                      <Mail className="h-6 w-6 text-accent" />
                    </div>
                    <h3 className="font-bold text-primary text-lg mb-3">General Enquiries</h3>
                    <div className="space-y-1 text-sm text-foreground/70">
                      <p className="font-medium text-foreground">Logistics Control Centre</p>
                      <p>logistics@sail.in</p>
                      <p>support@sailportlink.in</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2 border-primary/20 hover:border-accent transition-colors">
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center text-center">
                    <div className="h-12 w-12 rounded-full bg-accent/10 flex items-center justify-center mb-4">
                      <Phone className="h-6 w-6 text-accent" />
                    </div>
                    <h3 className="font-bold text-primary text-lg mb-3">Phone Support</h3>
                    <div className="space-y-1 text-sm text-foreground/70">
                      <p>+91-XXX-XXX-XXXX</p>
                      <p className="text-xs">(Mon-Fri, 9AM-6PM IST)</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2 border-primary/20 hover:border-accent transition-colors">
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center text-center">
                    <div className="h-12 w-12 rounded-full bg-accent/10 flex items-center justify-center mb-4">
                      <MapPin className="h-6 w-6 text-accent" />
                    </div>
                    <h3 className="font-bold text-primary text-lg mb-3">Address</h3>
                    <div className="space-y-1 text-sm text-foreground/70">
                      <p>Steel Authority of India Ltd.</p>
                      <p>Ispat Bhavan, Lodi Road</p>
                      <p>New Delhi - 110003</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="mb-12">
              <h2 className="text-3xl font-bold text-primary text-center mb-8">Plant-wise Logistics Contacts</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { name: "Bhilai Steel Plant", email: "bhilai.logistics@sail.in" },
                  { name: "Rourkela Steel Plant", email: "rourkela.logistics@sail.in" },
                  { name: "Bokaro Steel Plant", email: "bokaro.logistics@sail.in" },
                  { name: "Durgapur Steel Plant", email: "durgapur.logistics@sail.in" },
                  { name: "IISCO Steel Plant", email: "iisco.logistics@sail.in" },
                ].map((plant) => (
                  <Card key={plant.name} className="border border-primary/10">
                    <CardContent className="pt-6">
                      <div className="flex items-start gap-3">
                        <Building2 className="h-5 w-5 text-accent flex-shrink-0 mt-1" />
                        <div>
                          <p className="font-semibold text-sm text-primary mb-1">{plant.name}</p>
                          <p className="text-xs text-foreground/70">{plant.email}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            <Card className="border-2 border-primary/20">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold text-primary text-center mb-6">Send us an Enquiry</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-primary font-medium">
                        Name *
                      </Label>
                      <Input
                        id="name"
                        placeholder="Your name"
                        required
                        className="border-primary/30 focus:border-accent"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="organisation" className="text-primary font-medium">
                        Organisation
                      </Label>
                      <Input
                        id="organisation"
                        placeholder="Your organisation"
                        className="border-primary/30 focus:border-accent"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-primary font-medium">
                      Email *
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your.email@example.com"
                      required
                      className="border-primary/30 focus:border-accent"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message" className="text-primary font-medium">
                      Message *
                    </Label>
                    <Textarea
                      id="message"
                      placeholder="Tell us about your inquiry..."
                      rows={6}
                      required
                      className="border-primary/30 focus:border-accent resize-none"
                    />
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    className="w-full bg-accent hover:bg-accent/90 text-white font-semibold"
                    disabled={submitted}
                  >
                    {submitted ? "✓ Enquiry Sent!" : "Send Enquiry"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  )
}

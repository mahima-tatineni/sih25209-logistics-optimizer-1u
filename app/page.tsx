import Link from "next/link"
import Image from "next/image"
import { PublicNav } from "@/components/public-nav"
import { PublicFooter } from "@/components/public-footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Carousel } from "@/components/carousel"
import { FacilityCard } from "@/components/facility-card"
import { Ship, Anchor, TrendingUp, Brain, ChevronDown, Factory, MapPin, Badge } from "lucide-react"
import { getPlants, getPorts } from "@/lib/db-actions"

export default async function HomePage() {
  const plants = await getPlants()
  const ports = await getPorts()

  return (
    <div className="min-h-screen flex flex-col">
      <PublicNav />

      <main className="flex-1">
        <section className="relative min-h-[100vh] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0">
            <Carousel autoPlay interval={6000}>
              <div className="relative h-screen w-full">
                <Image
                  src="/images/bhilai-steel-plant.webp"
                  alt="Bhilai Steel Plant"
                  fill
                  className="object-cover brightness-50"
                />
              </div>
              <div className="relative h-screen w-full">
                <Image
                  src="/images/rourkela-steel-plant.jpg"
                  alt="Rourkela Steel Plant"
                  fill
                  className="object-cover brightness-50"
                />
              </div>
              <div className="relative h-screen w-full">
                <Image
                  src="/images/visakhapatnam-port.webp"
                  alt="Visakhapatnam Port"
                  fill
                  className="object-cover brightness-50"
                />
              </div>
              <div className="relative h-screen w-full">
                <Image src="/images/haldia-port.webp" alt="Haldia Port" fill className="object-cover brightness-50" />
              </div>
            </Carousel>
          </div>

          <div className="relative z-10 container mx-auto px-4 text-center">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 text-balance leading-tight drop-shadow-2xl">
              AI-Driven Port-to-Plant Logistics for SAIL
            </h1>
            <p className="text-lg md:text-2xl text-white mb-12 max-w-4xl mx-auto leading-relaxed text-pretty drop-shadow-lg">
              Plan and optimize coking coal and limestone movements from global ports to SAIL's integrated steel plants
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <Link href="/plants-and-ports">
                <Button
                  size="lg"
                  variant="secondary"
                  className="text-lg px-8 py-6 bg-white/90 hover:bg-white text-primary font-semibold"
                >
                  Explore Plants & Ports
                </Button>
              </Link>
              <Link href="/login">
                <Button size="lg" className="text-lg px-8 py-6 bg-accent hover:bg-accent/90 text-white font-semibold">
                  Launch Planner
                </Button>
              </Link>
            </div>

            <div className="flex flex-col items-center gap-2 text-white animate-bounce">
              <span className="text-sm">Scroll to explore</span>
              <ChevronDown className="h-6 w-6" />
            </div>
          </div>
        </section>

        <section className="py-20 bg-gradient-to-b from-white to-secondary/30">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold text-primary mb-6">SAIL's Logistics Network</h2>
                <p className="text-lg text-foreground/70 max-w-3xl mx-auto leading-relaxed">
                  Steel Authority of India Limited operates 5 integrated steel plants across India, importing coking
                  coal and limestone through strategic east-coast ports. The network handles over 17 million tonnes of
                  raw materials annually, moving from global supplier ports to plants via optimized rail routes.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <Card className="border-2 border-primary/20 hover:border-accent transition-all hover:shadow-lg">
                  <CardContent className="pt-6">
                    <div className="flex flex-col items-center text-center">
                      <Factory className="h-12 w-12 text-accent mb-4" />
                      <h3 className="text-2xl font-bold text-primary mb-2">5</h3>
                      <p className="text-sm text-foreground/70">Integrated Steel Plants</p>
                      <p className="text-xs text-foreground/60 mt-2">21+ MTPA combined crude steel capacity</p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-2 border-primary/20 hover:border-accent transition-all hover:shadow-lg">
                  <CardContent className="pt-6">
                    <div className="flex flex-col items-center text-center">
                      <Anchor className="h-12 w-12 text-accent mb-4" />
                      <h3 className="text-2xl font-bold text-primary mb-2">5</h3>
                      <p className="text-sm text-foreground/70">Strategic East-Coast Ports</p>
                      <p className="text-xs text-foreground/60 mt-2">Deep-sea & riverine capabilities</p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-2 border-primary/20 hover:border-accent transition-all hover:shadow-lg">
                  <CardContent className="pt-6">
                    <div className="flex flex-col items-center text-center">
                      <Ship className="h-12 w-12 text-accent mb-4" />
                      <h3 className="text-2xl font-bold text-primary mb-2">17+ MT</h3>
                      <p className="text-sm text-foreground/70">Annual Raw Material Imports</p>
                      <p className="text-xs text-foreground/60 mt-2">14 MT coking coal + 3 MT limestone</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 bg-gradient-to-b from-secondary/30 to-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-primary mb-4">Platform Capabilities</h2>
              <p className="text-lg text-foreground/70 max-w-3xl mx-auto">
                End-to-end optimization and AI-driven insights for logistics planning
              </p>
            </div>

            <div className="max-w-5xl mx-auto">
              <Carousel autoPlay interval={7000}>
                <Card className="border-2 border-primary/20 mx-4">
                  <CardContent className="p-12">
                    <div className="flex flex-col md:flex-row items-center gap-8">
                      <div className="flex-shrink-0">
                        <div className="h-24 w-24 rounded-full bg-accent/10 flex items-center justify-center">
                          <TrendingUp className="h-12 w-12 text-accent" />
                        </div>
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-primary mb-3">Cost Optimization Engine</h3>
                        <p className="text-foreground/70 leading-relaxed">
                          Advanced LP/MIP solvers minimize total landed cost by optimizing vessel-to-port assignments,
                          rail routing, and inventory levels while respecting all operational constraints and
                          capacities.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-2 border-primary/20 mx-4">
                  <CardContent className="p-12">
                    <div className="flex flex-col md:flex-row items-center gap-8">
                      <div className="flex-shrink-0">
                        <div className="h-24 w-24 rounded-full bg-accent/10 flex items-center justify-center">
                          <Brain className="h-12 w-12 text-accent" />
                        </div>
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-primary mb-3">AI Delay Prediction</h3>
                        <p className="text-foreground/70 leading-relaxed">
                          Machine learning models analyze historical data, weather patterns, and port conditions to
                          predict pre-berthing delays, enabling proactive planning and demurrage risk mitigation.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-2 border-primary/20 mx-4">
                  <CardContent className="p-12">
                    <div className="flex flex-col md:flex-row items-center gap-8">
                      <div className="flex-shrink-0">
                        <div className="h-24 w-24 rounded-full bg-accent/10 flex items-center justify-center">
                          <Ship className="h-12 w-12 text-accent" />
                        </div>
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-primary mb-3">What-If Scenario Planning</h3>
                        <p className="text-foreground/70 leading-relaxed">
                          Compare alternative routing scenarios, evaluate port capacity changes, and assess the impact
                          of market conditions before committing to procurement and logistics decisions.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-2 border-primary/20 mx-4">
                  <CardContent className="p-12">
                    <div className="flex flex-col md:flex-row items-center gap-8">
                      <div className="flex-shrink-0">
                        <div className="h-24 w-24 rounded-full bg-accent/10 flex items-center justify-center">
                          <MapPin className="h-12 w-12 text-accent" />
                        </div>
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-primary mb-3">Real-Time Monitoring</h3>
                        <p className="text-foreground/70 leading-relaxed">
                          Track vessel positions, monitor stock levels at ports and plants, view rake schedules, and
                          receive alerts for exceptions requiring intervention—all in one unified dashboard.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Carousel>
            </div>
          </div>
        </section>

        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-primary mb-4">Our Steel Plants</h2>
              <p className="text-lg text-foreground/70 max-w-3xl mx-auto mb-8">
                Five integrated steel plants across India with combined capacity of 21+ MTPA
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-12">
              {plants.slice(0, 5).map((plant) => (
                <FacilityCard key={plant.code} type="plant" data={plant} />
              ))}
            </div>

            <div className="text-center mb-12 mt-20">
              <h2 className="text-4xl font-bold text-primary mb-4">Our Strategic Ports</h2>
              <p className="text-lg text-foreground/70 max-w-3xl mx-auto mb-8">
                East coast ports handling 17+ MT of annual coal and limestone imports
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-12">
              {ports.slice(0, 5).map((port) => (
                <FacilityCard key={port.code} type="port" data={port} />
              ))}
            </div>

            <div className="text-center">
              <Link href="/plants-and-ports">
                <Button size="lg" className="bg-accent hover:bg-accent/90 text-white font-semibold">
                  View Full Network Details
                </Button>
              </Link>
            </div>
          </div>
        </section>

        <section className="py-20 bg-gradient-to-r from-primary/5 to-accent/5">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-primary mb-4">Latest Active Schedules</h2>
              <p className="text-lg text-foreground/70 max-w-3xl mx-auto">
                Real-time vessel schedules and logistics operations
              </p>
            </div>

            <div className="max-w-6xl mx-auto">
              <Card className="border-2 border-primary/20">
                <CardContent className="p-6">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-primary/10">
                          <th className="text-left py-3 px-4 font-semibold text-primary">Vessel</th>
                          <th className="text-left py-3 px-4 font-semibold text-primary">Origin</th>
                          <th className="text-left py-3 px-4 font-semibold text-primary">Discharge Port</th>
                          <th className="text-left py-3 px-4 font-semibold text-primary">Destination Plant</th>
                          <th className="text-left py-3 px-4 font-semibold text-primary">Material</th>
                          <th className="text-left py-3 px-4 font-semibold text-primary">ETA</th>
                          <th className="text-left py-3 px-4 font-semibold text-primary">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          {
                            vessel: "MV Pacific Glory",
                            origin: "Gladstone",
                            port: "Vizag",
                            plant: "Bhilai",
                            material: "Coking Coal",
                            eta: "2025-02-05",
                            status: "In Transit",
                          },
                          {
                            vessel: "MV Ocean Star",
                            origin: "Newcastle",
                            port: "Paradip",
                            plant: "Rourkela",
                            material: "Coking Coal",
                            eta: "2025-02-08",
                            status: "In Transit",
                          },
                          {
                            vessel: "MV Steel Carrier",
                            origin: "Maputo",
                            port: "Vizag",
                            plant: "Bhilai",
                            material: "Coking Coal",
                            eta: "2025-02-15",
                            status: "Planned",
                          },
                          {
                            vessel: "Rail Rake #R-2401",
                            origin: "Paradip",
                            port: "Local",
                            plant: "Rourkela",
                            material: "Coking Coal",
                            eta: "2025-01-08",
                            status: "In Transit",
                          },
                          {
                            vessel: "MV Global Trader",
                            origin: "Richards Bay",
                            port: "Haldia",
                            plant: "Durgapur",
                            material: "Limestone",
                            eta: "2025-02-10",
                            status: "Planned",
                          },
                        ].map((schedule, idx) => (
                          <tr key={idx} className="border-b border-primary/5 hover:bg-primary/5 transition-colors">
                            <td className="py-3 px-4 font-semibold text-primary">{schedule.vessel}</td>
                            <td className="py-3 px-4 text-foreground/70">{schedule.origin}</td>
                            <td className="py-3 px-4 text-foreground/70">{schedule.port}</td>
                            <td className="py-3 px-4 text-foreground/70">{schedule.plant}</td>
                            <td className="py-3 px-4 text-foreground/70">{schedule.material}</td>
                            <td className="py-3 px-4 font-medium text-foreground">{schedule.eta}</td>
                            <td className="py-3 px-4">
                              <Badge
                                variant={
                                  schedule.status === "In Transit"
                                    ? "default"
                                    : schedule.status === "Planned"
                                      ? "secondary"
                                      : "outline"
                                }
                              >
                                {schedule.status}
                              </Badge>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>

              <div className="mt-8 text-center">
                <Link href="/login">
                  <Button size="lg" className="bg-accent hover:bg-accent/90 text-white font-semibold">
                    View Full Logistics Console
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 bg-gradient-to-br from-primary via-[#004f6e] to-[#003547] text-white">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold mb-4">Get in Touch</h2>
                <p className="text-xl text-white/90">Connect with SAIL's logistics team for inquiries and support</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <Card className="bg-white/10 border-white/20 backdrop-blur hover:bg-white/20 transition-all">
                  <CardContent className="p-6 text-center">
                    <div className="h-16 w-16 rounded-full bg-accent/20 flex items-center justify-center mx-auto mb-4">
                      <Ship className="h-8 w-8 text-accent" />
                    </div>
                    <h3 className="text-lg font-bold mb-3">Logistics Control</h3>
                    <p className="text-sm text-white/80 mb-2">24/7 Operations Center</p>
                    <p className="text-sm text-white/70">logistics@sail.in</p>
                  </CardContent>
                </Card>

                <Card className="bg-white/10 border-white/20 backdrop-blur hover:bg-white/20 transition-all">
                  <CardContent className="p-6 text-center">
                    <div className="h-16 w-16 rounded-full bg-accent/20 flex items-center justify-center mx-auto mb-4">
                      <Brain className="h-8 w-8 text-accent" />
                    </div>
                    <h3 className="text-lg font-bold mb-3">Technical Support</h3>
                    <p className="text-sm text-white/80 mb-2">PortLink AI Platform</p>
                    <p className="text-sm text-white/70">support@sailportlink.in</p>
                  </CardContent>
                </Card>

                <Card className="bg-white/10 border-white/20 backdrop-blur hover:bg-white/20 transition-all">
                  <CardContent className="p-6 text-center">
                    <div className="h-16 w-16 rounded-full bg-accent/20 flex items-center justify-center mx-auto mb-4">
                      <Factory className="h-8 w-8 text-accent" />
                    </div>
                    <h3 className="text-lg font-bold mb-3">Plant Contacts</h3>
                    <p className="text-sm text-white/80 mb-2">Direct plant logistics teams</p>
                    <Link href="/contact" className="text-sm text-accent hover:text-accent/80 font-semibold">
                      View all contacts →
                    </Link>
                  </CardContent>
                </Card>
              </div>

              <div className="text-center">
                <Link href="/contact">
                  <Button
                    size="lg"
                    variant="secondary"
                    className="bg-white text-primary hover:bg-white/90 font-semibold"
                  >
                    Full Contact Information
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  )
}

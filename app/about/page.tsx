import { PublicNav } from "@/components/public-nav"
import { PublicFooter } from "@/components/public-footer"
import { Card, CardContent } from "@/components/ui/card"
import { Factory, Anchor, TrendingUp, Users, Ship, Brain, LineChart } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <PublicNav />

      <main className="flex-1">
        <section className="bg-gradient-to-br from-[#004f6e] via-[#00425c] to-[#003547] text-white py-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-balance">About SAIL Logistics</h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto text-pretty leading-relaxed">
              Transforming raw material logistics for India's largest steel producer
            </p>
          </div>
        </section>

        <section className="py-16 container mx-auto px-4">
          <div className="max-w-4xl mx-auto space-y-12">
            <div>
              <h2 className="text-3xl font-bold text-primary mb-6">The Challenge</h2>
              <p className="text-lg text-foreground/80 leading-relaxed">
                Steel Authority of India Limited (SAIL) operates 5 major integrated steel plants across India with a
                combined crude steel capacity of over 21 million tonnes per annum. The company imports approximately 14
                Mt of coking coal and 3 Mt of limestone annually, with over 80% of coking coal sourced from
                international suppliers.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="border-2 border-primary/20 hover:border-accent transition-colors">
                <CardContent className="pt-6">
                  <Factory className="h-10 w-10 text-accent mb-4" />
                  <h3 className="text-xl font-semibold text-primary mb-2">Complex Network</h3>
                  <p className="text-sm text-foreground/70 leading-relaxed">
                    Managing material flow from 10+ global supplier ports to 5 Indian discharge ports, then via rail to
                    plants across multiple states requires sophisticated coordination.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2 border-primary/20 hover:border-accent transition-colors">
                <CardContent className="pt-6">
                  <Anchor className="h-10 w-10 text-accent mb-4" />
                  <h3 className="text-xl font-semibold text-primary mb-2">Port Optimization</h3>
                  <p className="text-sm text-foreground/70 leading-relaxed">
                    Each port has different handling capacities, draft limitations, tariffs, and rail connectivity.
                    Optimal port selection directly impacts total landed costs.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2 border-primary/20 hover:border-accent transition-colors">
                <CardContent className="pt-6">
                  <TrendingUp className="h-10 w-10 text-accent mb-4" />
                  <h3 className="text-xl font-semibold text-primary mb-2">Cost Pressure</h3>
                  <p className="text-sm text-foreground/70 leading-relaxed">
                    Ocean freight differentials, port charges, rail freight, demurrage, and storage costs all vary
                    significantly. Even small optimization gains translate to crores in annual savings.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2 border-primary/20 hover:border-accent transition-colors">
                <CardContent className="pt-6">
                  <Users className="h-10 w-10 text-accent mb-4" />
                  <h3 className="text-xl font-semibold text-primary mb-2">Stock Management</h3>
                  <p className="text-sm text-foreground/70 leading-relaxed">
                    Maintaining 30 days of combined stock cover at ports and plants while avoiding both stockouts and
                    excessive inventory carrying costs requires precise planning.
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-8 rounded-2xl border-2 border-primary/10">
              <h2 className="text-3xl font-bold text-primary mb-6">The Solution</h2>
              <p className="text-lg text-foreground/80 leading-relaxed mb-6">
                The SAIL Logistics Optimizer brings together advanced mathematical optimization, AI/ML predictions, and
                real-time monitoring to create an end-to-end planning and execution platform.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <LineChart className="h-8 w-8 text-accent mb-2" />
                  <h4 className="font-semibold text-primary mb-1">Cost Optimization</h4>
                  <p className="text-sm text-foreground/70">LP/MIP solvers minimize total landed cost</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <Brain className="h-8 w-8 text-accent mb-2" />
                  <h4 className="font-semibold text-primary mb-1">AI Predictions</h4>
                  <p className="text-sm text-foreground/70">ML models forecast delays and risks</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <Ship className="h-8 w-8 text-accent mb-2" />
                  <h4 className="font-semibold text-primary mb-1">Real-time Tracking</h4>
                  <p className="text-sm text-foreground/70">Live visibility across the network</p>
                </div>
              </div>

              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <span className="text-accent font-bold text-xl mt-1">→</span>
                  <span className="text-foreground/80">
                    <strong className="text-primary">Cost Optimization:</strong> LP/MIP solvers minimize total landed
                    cost while respecting all operational constraints
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-accent font-bold text-xl mt-1">→</span>
                  <span className="text-foreground/80">
                    <strong className="text-primary">AI Predictions:</strong> Machine learning models forecast delays,
                    congestion, and demurrage risks
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-accent font-bold text-xl mt-1">→</span>
                  <span className="text-foreground/80">
                    <strong className="text-primary">Scenario Planning:</strong> What-if analysis enables planners to
                    evaluate alternatives before execution
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-accent font-bold text-xl mt-1">→</span>
                  <span className="text-foreground/80">
                    <strong className="text-primary">Real-time Visibility:</strong> Dashboards provide up-to-date stock
                    positions, vessel tracking, and performance metrics
                  </span>
                </li>
              </ul>
            </div>

            <div>
              <h2 className="text-3xl font-bold text-primary mb-6">Need for Automation</h2>
              <p className="text-lg text-foreground/80 leading-relaxed">
                With hundreds of vessels arriving annually, thousands of rake movements, and continuous plant
                consumption, manual planning is no longer sufficient. The Logistics Optimizer automates routine
                decisions, highlights exceptions, and empowers planners to focus on strategic improvements rather than
                tactical firefighting.
              </p>
            </div>
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  )
}

import { PublicNav } from "@/components/public-nav"
import { PublicFooter } from "@/components/public-footer"
import { FacilityCard } from "@/components/facility-card"
import { getPlants, getPorts } from "@/lib/db-actions"

export default async function PlantsAndPortsPage() {
  const plants = await getPlants()
  const ports = await getPorts()

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white to-secondary/30">
      <PublicNav />

      <main className="flex-1">
        <section className="bg-gradient-to-br from-[#004f6e] via-[#00425c] to-[#003547] text-white py-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-balance">Plants & Ports Network</h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto text-pretty leading-relaxed">
              Explore SAIL's 5 integrated steel plants and strategic east-coast import ports
            </p>
          </div>
        </section>

        <section className="py-16 container mx-auto px-4">
          <div className="mb-16">
            <div className="text-center mb-10">
              <h2 className="text-4xl font-bold text-primary mb-4">5 Integrated Steel Plants</h2>
              <p className="text-lg text-foreground/70 max-w-3xl mx-auto">
                SAIL operates five major integrated steel plants across India with a combined capacity of over 21 MTPA
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {plants.map((plant) => (
                <FacilityCard key={plant.code} type="plant" data={plant} />
              ))}
            </div>
          </div>

          <div>
            <div className="text-center mb-10">
              <h2 className="text-4xl font-bold text-primary mb-4">Key Import Ports</h2>
              <p className="text-lg text-foreground/70 max-w-3xl mx-auto">
                Five strategic east-coast ports handle SAIL's coking coal and limestone imports
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {ports.map((port) => (
                <FacilityCard key={port.code} type="port" data={port} />
              ))}
            </div>
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  )
}

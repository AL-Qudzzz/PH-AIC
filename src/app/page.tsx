import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bot, BrainCircuit, Search, Users } from "lucide-react";
import Link from "next/link";

export default function Home() {
  const features = [
    {
      icon: <Bot className="h-10 w-10" />,
      title: "AI Call Triage",
      description: "Speech-to-text and NLP in Bahasa Indonesia to understand the emergency.",
    },
    {
      icon: <BrainCircuit className="h-10 w-10" />,
      title: "Emergency Classification",
      description: "AI-powered decision tool automatically categorizes the type of emergency.",
    },
    {
      icon: <Search className="h-10 w-10" />,
      title: "Key Info Extraction",
      description: "Algorithm tool extracts key details ('what' and 'where') automatically.",
    },
    {
      icon: <Users className="h-10 w-10" />,
      title: "Incident Cluster Detection",
      description: "Detects potential large-scale events by spotting multiple similar reports.",
    },
  ];

  return (
    <div className="flex flex-col items-center text-center">
      <section className="w-full py-20 md:py-32">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4">
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl text-primary">
              SIAGA 112 AI
            </h1>
            <p className="max-w-[700px] text-primary/80 md:text-xl">
              Revolutionizing Emergency Response in Indonesia with Artificial Intelligence.
            </p>
            <div className="flex space-x-4">
              <Button asChild size="lg">
                <Link href="/user">Report an Emergency</Link>
              </Button>
              <Button asChild variant="secondary" size="lg">
                <Link href="/admin">Operator Dashboard</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="w-full py-12 md:py-24">
        <div className="container px-4 md:px-6">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-12 text-primary">
            Core Features
          </h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => (
              <Card key={index} className="flex flex-col items-center text-center p-6 bg-card/80 backdrop-blur-sm">
                <CardHeader className="p-0 mb-4">
                  <div className="p-4 bg-primary/10 rounded-full text-primary">
                    {feature.icon}
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <CardTitle className="text-xl font-bold mb-2 text-primary">{feature.title}</CardTitle>
                  <p className="text-primary/70">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

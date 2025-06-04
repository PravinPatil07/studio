import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Droplet, Users, Heart } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Logo } from "@/components/logo";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-card shadow-md">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <Logo />
          <nav className="space-x-4">
            <Button variant="ghost" asChild>
              <Link href="/auth/login">Login</Link>
            </Button>
            <Button variant="default" asChild className="bg-primary hover:bg-primary/90 text-primary-foreground">
              <Link href="/auth/signup">Sign Up</Link>
            </Button>
          </nav>
        </div>
      </header>

      <main className="flex-grow">
        <section className="py-16 md:py-24 bg-gradient-to-br from-rose-50 via-red-50 to-rose-100">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-headline font-bold text-primary mb-6">
              Donate Blood, Save Lives
            </h1>
            <p className="text-lg sm:text-xl text-foreground/80 max-w-2xl mx-auto mb-8">
              LifeFlow connects compassionate donors with those in urgent need. Join our community and make a difference today.
            </p>
            <Button size="lg" asChild className="bg-accent hover:bg-accent/90 text-accent-foreground">
              <Link href="/auth/signup">Get Started</Link>
            </Button>
            <div className="mt-12">
              <Image 
                src="https://placehold.co/800x400.png" 
                alt="Community of blood donors" 
                width={800} 
                height={400}
                className="rounded-lg shadow-xl mx-auto"
                data-ai-hint="community donation"
              />
            </div>
          </div>
        </section>

        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl sm:text-4xl font-headline font-semibold text-center text-primary mb-12">
              How LifeFlow Works
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <Card className="shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader className="items-center">
                  <div className="p-3 bg-primary/10 rounded-full mb-2">
                    <Droplet className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle className="font-headline text-center">Request Blood</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-center">
                    Easily submit a blood request with necessary details. Your request reaches potential donors quickly.
                  </CardDescription>
                </CardContent>
              </Card>
              <Card className="shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader className="items-center">
                  <div className="p-3 bg-accent/10 rounded-full mb-2">
                    <Users className="h-8 w-8 text-accent" />
                  </div>
                  <CardTitle className="font-headline text-center">Find Donors</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-center">
                    Search for eligible blood donors in your area based on blood group and location.
                  </CardDescription>
                </CardContent>
              </Card>
              <Card className="shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader className="items-center">
                   <div className="p-3 bg-red-500/10 rounded-full mb-2">
                    <Heart className="h-8 w-8 text-red-500" />
                  </div>
                  <CardTitle className="font-headline text-center">Donate & Inspire</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-center">
                    Become a hero. Donate blood, track your contributions, and receive certificates for your selfless act.
                  </CardDescription>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section className="py-16 md:py-24 bg-muted/50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl sm:text-4xl font-headline font-semibold text-primary mb-6">
              Join the LifeFlow Community
            </h2>
            <p className="text-lg sm:text-xl text-foreground/80 max-w-2xl mx-auto mb-8">
              Every drop counts. Your contribution can bring hope and save lives. Register as a donor or request blood when in need.
            </p>
            <div className="space-x-4">
              <Button size="lg" asChild className="bg-primary hover:bg-primary/90 text-primary-foreground">
                <Link href="/auth/signup">Sign Up to Donate</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/dashboard/request-blood">Request Blood</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-card border-t py-8 text-center">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <Logo className="justify-center mb-2" />
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} LifeFlow. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

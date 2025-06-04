// src/app/(app)/dashboard/ai-guidance/page.tsx
"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Zap, Lightbulb, CalendarIcon, AlertTriangle, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { donationScheduleGuidance, type DonationScheduleGuidanceInput, type DonationScheduleGuidanceOutput } from "@/ai/flows/donation-schedule-guidance";
import { bloodGroupsList, type BloodGroup } from "@/types";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

const formSchema = z.object({
  userId: z.string().min(1, { message: "User ID is required for personalization." }),
  lastDonationDate: z.date().optional(),
  lastDonationAmount: z.string().optional(),
  bloodType: z.enum(bloodGroupsList as [BloodGroup, ...BloodGroup[]], { required_error: "Blood type is required." }),
  healthConsiderations: z.string().optional(),
});

export default function AiGuidancePage() {
  const { toast } = useToast();
  const [guidance, setGuidance] = useState<DonationScheduleGuidanceOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      userId: "user123", // Mock user ID
      healthConsiderations: "",
      lastDonationAmount: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setGuidance(null);
    setError(null);

    const donationHistory = [];
    if (values.lastDonationDate && values.lastDonationAmount) {
      donationHistory.push({
        date: values.lastDonationDate.toISOString(),
        amount: values.lastDonationAmount,
      });
    } else if (values.lastDonationDate && !values.lastDonationAmount) {
        donationHistory.push({
        date: values.lastDonationDate.toISOString(),
        amount: "1 unit (default)", // Provide a default if amount is missing but date is present
      });
    }


    const input: DonationScheduleGuidanceInput = {
      userId: values.userId,
      donationHistory: donationHistory,
      bloodType: values.bloodType,
      healthConsiderations: values.healthConsiderations || "None",
    };

    try {
      const result = await donationScheduleGuidance(input);
      setGuidance(result);
      toast({
        title: "Guidance Generated!",
        description: "Personalized donation advice is ready.",
      });
    } catch (e) {
      console.error("Error getting AI guidance:", e);
      setError("Failed to generate guidance. Please try again.");
      toast({
        title: "Error",
        description: "Could not generate AI guidance.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div>
      <PageHeader 
        title="AI Donation Guidance"
        description="Get personalized advice to optimize your donation schedule and impact."
        icon={Zap}
      />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-1 shadow-xl">
          <CardHeader>
            <CardTitle className="font-headline text-xl text-primary">Your Information</CardTitle>
            <CardDescription>Provide details for tailored advice.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="userId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>User ID (Mock)</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your user ID" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="bloodType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Your Blood Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select your blood group" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {bloodGroupsList.map((group) => (
                            <SelectItem key={group} value={group}>{group}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="lastDonationDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Last Donation Date (Optional)</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full justify-start text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) => date > new Date()}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="lastDonationAmount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last Donation Amount (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., 1 unit, 450ml" {...field} />
                      </FormControl>
                       <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="healthConsiderations"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Health Considerations (Optional)</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Any relevant health information..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground" disabled={isLoading}>
                  {isLoading ? "Generating..." : "Get Guidance"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        <div className="lg:col-span-2">
          {isLoading && (
            <Card className="shadow-xl animate-pulse">
              <CardHeader>
                <div className="h-6 bg-muted rounded w-3/4"></div>
                <div className="h-4 bg-muted rounded w-1/2 mt-1"></div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="h-4 bg-muted rounded w-full"></div>
                <div className="h-4 bg-muted rounded w-5/6"></div>
                <div className="h-4 bg-muted rounded w-full"></div>
                <div className="h-4 bg-muted rounded w-4/6"></div>
              </CardContent>
            </Card>
          )}
          {!isLoading && guidance && (
            <Card className="shadow-xl bg-gradient-to-br from-teal-50 via-cyan-50 to-sky-50 border-accent">
              <CardHeader>
                 <div className="flex items-center space-x-2 text-accent">
                    <Lightbulb className="h-8 w-8" />
                    <CardTitle className="font-headline text-2xl text-accent">Personalized Donation Plan</CardTitle>
                 </div>
                <CardDescription className="text-accent/80">Here's your AI-powered donation guidance.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold text-lg text-foreground flex items-center">
                    <CalendarIcon className="mr-2 h-5 w-5 text-primary" />
                    Next Recommended Donation Date:
                  </h3>
                  <p className="text-primary text-xl font-bold pl-7">{format(new Date(guidance.nextDonationDate), "PPP")}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-foreground">Reasoning:</h3>
                  <p className="text-foreground/90 whitespace-pre-wrap bg-background/50 p-3 rounded-md border border-border">
                    {guidance.reasoning}
                  </p>
                </div>
                <div className="pt-4 border-t border-border/50">
                    <h4 className="font-semibold text-md text-foreground mb-1">General Advice:</h4>
                    <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                        <li>Ensure you are well-hydrated before and after donation.</li>
                        <li>Eat a healthy meal before donating.</li>
                        <li>Avoid strenuous activity after donation.</li>
                        <li>Always consult your doctor if you have health concerns.</li>
                    </ul>
                </div>
              </CardContent>
               <CardFooter>
                <p className="text-xs text-muted-foreground">
                  This guidance is AI-generated and for informational purposes only. Always consult with healthcare professionals for medical advice.
                </p>
              </CardFooter>
            </Card>
          )}
          {!isLoading && error && (
            <Card className="shadow-xl border-destructive">
              <CardHeader>
                <div className="flex items-center space-x-2 text-destructive">
                    <AlertTriangle className="h-6 w-6" />
                    <CardTitle className="font-headline text-xl text-destructive">Error Generating Guidance</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-destructive-foreground/90">{error}</p>
              </CardContent>
            </Card>
          )}
          {!isLoading && !guidance && !error && (
             <Card className="shadow-xl h-full flex flex-col items-center justify-center text-center p-8 bg-card">
                <Zap className="h-16 w-16 text-muted-foreground/50 mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">Ready for your guidance?</h3>
                <p className="text-muted-foreground">
                  Fill in your details on the left and click "Get Guidance" to receive personalized advice from our AI.
                </p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

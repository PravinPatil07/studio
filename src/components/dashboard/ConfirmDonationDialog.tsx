
// src/components/dashboard/ConfirmDonationDialog.tsx
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useEffect } from "react";

const confirmDonationSchema = z.object({
  donationDate: z.date({ required_error: "Donation date is required." }),
  donationLocation: z.string().optional(),
  notes: z.string().optional(),
});

export type ConfirmDonationFormValues = z.infer<typeof confirmDonationSchema>;

interface ConfirmDonationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: ConfirmDonationFormValues) => Promise<void>;
  isProcessing: boolean;
  initialLocation?: string;
  requesterName?: string;
}

export function ConfirmDonationDialog({
  isOpen,
  onClose,
  onSubmit,
  isProcessing,
  initialLocation = "",
  requesterName = "the recipient"
}: ConfirmDonationDialogProps) {
  const form = useForm<ConfirmDonationFormValues>({
    resolver: zodResolver(confirmDonationSchema),
    defaultValues: {
      donationDate: new Date(),
      donationLocation: initialLocation,
      notes: "",
    },
  });

   useEffect(() => {
    if (isOpen) {
      form.reset({
        donationDate: new Date(),
        donationLocation: initialLocation,
        notes: `Donation for ${requesterName}`,
      });
    }
  }, [isOpen, initialLocation, requesterName, form]);


  const handleFormSubmit = async (values: ConfirmDonationFormValues) => {
    await onSubmit(values);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-primary">Confirm Your Donation</DialogTitle>
          <DialogDescription>
            Please provide details about your recent donation to fulfill the request for {requesterName}.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="donationDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Actual Donation Date</FormLabel>
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
                        disabled={(date) => date > new Date()} // Cannot select future date
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
              name="donationLocation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Donation Location (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., City Hospital Blood Drive" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes (Optional)</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Any specific details about your donation..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter className="pt-4">
              <DialogClose asChild>
                <Button type="button" variant="outline" onClick={onClose} disabled={isProcessing}>
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit" className="bg-primary hover:bg-primary/90 text-primary-foreground" disabled={isProcessing}>
                {isProcessing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isProcessing ? "Processing..." : "Confirm & Generate Certificate"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

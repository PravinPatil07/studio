// src/components/dashboard/donor-search-form.tsx
"use client";

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
import { bloodGroupsList, type BloodGroup } from "@/types";
import { SearchIcon } from "lucide-react";

// Define a unique, non-empty string for the "Any Blood Group" option
export const ANY_BLOOD_GROUP_VALUE = "__ANY_BLOOD_GROUP__" as const;
const extendedBloodGroupsList = [...bloodGroupsList, ANY_BLOOD_GROUP_VALUE] as const;

const formSchema = z.object({
  bloodGroup: z.enum(extendedBloodGroupsList).optional(),
  city: z.string().optional(),
});

export type DonorSearchFormValues = z.infer<typeof formSchema>;

interface DonorSearchFormProps {
  onSearch: (filters: DonorSearchFormValues) => void;
}

export function DonorSearchForm({ onSearch }: DonorSearchFormProps) {
  const form = useForm<DonorSearchFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      city: "",
      bloodGroup: undefined, // Initial value is undefined, placeholder will show
    },
  });

  function onSubmit(values: DonorSearchFormValues) {
    onSearch(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="mb-8 p-6 bg-card rounded-xl shadow-lg space-y-4 md:flex md:items-end md:space-y-0 md:space-x-4">
        <FormField
          control={form.control}
          name="bloodGroup"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormLabel>Blood Group</FormLabel>
              <Select onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Any Blood Group" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value={ANY_BLOOD_GROUP_VALUE}>Any Blood Group</SelectItem>
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
          name="city"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormLabel>City</FormLabel>
              <FormControl>
                <Input placeholder="Enter city name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full md:w-auto bg-primary hover:bg-primary/90 text-primary-foreground">
          <SearchIcon className="mr-2 h-4 w-4" /> Search Donors
        </Button>
      </form>
    </Form>
  );
}

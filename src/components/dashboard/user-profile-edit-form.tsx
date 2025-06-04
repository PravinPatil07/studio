
// src/components/dashboard/user-profile-edit-form.tsx
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
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, Loader2 } from "lucide-react";
import { format, differenceInYears } from "date-fns";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { bloodGroupsList, type BloodGroup, type User as AppUserType } from "@/types";
import { auth, db } from "@/lib/firebase"; // Import db
import { updateProfile } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore"; // Import Firestore functions
import { useState } from "react";

const editProfileFormSchema = z.object({
  firstName: z.string().min(1, { message: "First name is required." }),
  lastName: z.string().min(1, { message: "Last name is required." }),
  bloodGroup: z.enum(bloodGroupsList as [BloodGroup, ...BloodGroup[]], { required_error: "Blood group is required." }),
  dateOfBirth: z.date({ required_error: "Date of birth is required." }),
  address: z.string().min(1, { message: "Address is required." }),
  contactNumber: z.string().min(10, { message: "Contact number must be at least 10 digits." }).regex(/^\+?[0-9\s-()]+$/, "Invalid phone number format."),
});

type EditProfileFormValues = z.infer<typeof editProfileFormSchema>;

interface UserProfileEditFormProps {
  currentUserData: AppUserType;
  onSave: (updatedData: AppUserType) => void;
  onCancel: () => void;
}

export function UserProfileEditForm({ currentUserData, onSave, onCancel }: UserProfileEditFormProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const firebaseUser = auth.currentUser;

  const form = useForm<EditProfileFormValues>({
    resolver: zodResolver(editProfileFormSchema),
    defaultValues: {
      firstName: currentUserData.firstName,
      lastName: currentUserData.lastName,
      bloodGroup: currentUserData.bloodGroup as BloodGroup, // Cast if necessary, ensure it's a valid BloodGroup
      dateOfBirth: currentUserData.dateOfBirth ? new Date(currentUserData.dateOfBirth) : new Date(),
      address: currentUserData.address,
      contactNumber: currentUserData.contactNumber,
    },
  });

  async function onSubmit(values: EditProfileFormValues) {
    if (!firebaseUser) {
      toast({ title: "Error", description: "You must be logged in to update your profile.", variant: "destructive" });
      return;
    }
    setIsLoading(true);

    try {
      // Update Firebase Auth display name (optional, but good for consistency)
      if (firebaseUser.displayName !== `${values.firstName} ${values.lastName}`) {
        await updateProfile(firebaseUser, {
          displayName: `${values.firstName} ${values.lastName}`
        });
      }

      const age = differenceInYears(new Date(), values.dateOfBirth);
      const updatedFirestoreData: AppUserType = {
        ...currentUserData, // Preserve existing fields like id, email, donationHistory
        firstName: values.firstName,
        lastName: values.lastName,
        bloodGroup: values.bloodGroup,
        dateOfBirth: values.dateOfBirth.toISOString(),
        age: age,
        address: values.address,
        contactNumber: values.contactNumber,
      };
      
      // Save/Update profile data in Firestore
      const userDocRef = doc(db, "users", firebaseUser.uid);
      await setDoc(userDocRef, updatedFirestoreData, { merge: true }); // Use merge to prevent overwriting if doc exists
      
      onSave(updatedFirestoreData); // Pass updated data to parent to update local state
      toast({ title: "Profile Updated", description: "Your profile has been successfully updated in Firestore." });

    } catch (error: any) {
      console.error("Error updating profile:", error);
      let errorMessage = "Could not update your profile. Please try again.";
      if (error.code === 'firestore/permission-denied') {
        errorMessage = "Permission denied when trying to save profile. Please check Firestore rules.";
      }
      toast({ title: "Update Failed", description: errorMessage, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 p-6 sm:p-8 bg-card rounded-xl shadow-xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>First Name</FormLabel>
                <FormControl>
                  <Input placeholder="John" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Last Name</FormLabel>
                <FormControl>
                  <Input placeholder="Doe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="bloodGroup"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Blood Group</FormLabel>
                <Select onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select blood group" />
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
            name="dateOfBirth"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Date of Birth</FormLabel>
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
                      disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                      initialFocus
                      captionLayout="dropdown-buttons"
                      fromYear={1900}
                      toYear={new Date().getFullYear()}
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address</FormLabel>
              <FormControl>
                <Input placeholder="123 Main St, Anytown" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="contactNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Contact Number</FormLabel>
              <FormControl>
                <Input placeholder="+1 123 456 7890" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex flex-col sm:flex-row gap-4 pt-4">
          <Button type="submit" className="w-full sm:w-auto flex-1 bg-primary hover:bg-primary/90 text-primary-foreground" disabled={isLoading}>
            {isLoading ? <Loader2 className="animate-spin mr-2" /> : null}
            {isLoading ? "Saving..." : "Save Changes"}
          </Button>
          <Button type="button" variant="outline" className="w-full sm:w-auto flex-1" onClick={onCancel} disabled={isLoading}>
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  );
}


"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { useState } from "react";
import { toast } from "sonner";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Loader from "./loader";
import { useUserStore } from "@/store/userStore";
import { Switch } from "../ui/switch";
import { CreateElementAPI } from "@/lib/apis";

const elementSchema = z.object({
  imageUrl: z.string().url("Must be a valid URL"),
  width: z.coerce.number().min(1, "Width must be at least 1"),
  height: z.coerce.number().min(1, "Height must be at least 1"),
  static: z.boolean(),
});

const fieldLabels: Record<keyof z.infer<typeof elementSchema>, string> = {
  imageUrl: "Image URL",
  width: "Width (px)",
  height: "Height (px)",
  static: "Static (blocksMovement)",
};

export default function CreateElementForm() {
  const token = useUserStore((state) => state.userToken);
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof elementSchema>>({
    resolver: zodResolver(elementSchema),
    defaultValues: {
      imageUrl: "",
      width: 40,
      height: 40,
      static: false,
    },
  });

  const onSubmit = async (data: z.infer<typeof elementSchema>) => {
    if (!token) return toast("You are not logged in");
    try {
      setLoading(true);
      const response = await CreateElementAPI(token, data);
      if (response.status === 200) {
        toast("Element created successfully!");
        form.reset();
      } else {
        throw Error;
      }
    } catch (error) {
      console.error(error);
      toast("Failed to create element");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full max-w-4xl px-4 lg:px-0"
      >
        <h1 className="text-3xl font-semibold text-center text-custom-text-primary my-5">
          Create Element
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {(["imageUrl", "width", "height"] as const).map((fieldName) => (
            <FormField
              key={fieldName}
              control={form.control}
              name={fieldName}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-medium text-custom-text-primary">
                    {fieldLabels[fieldName]}
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type={
                        fieldName === "width" || fieldName === "height"
                          ? "number"
                          : "text"
                      }
                      placeholder={`Enter ${fieldLabels[fieldName]}`}
                      className="w-full rounded-md border border-gray-600 bg-custom-bg-dark-2 px-3 py-2 text-custom-text-primary transition focus:outline-none"
                      onFocus={(e) => {
                        e.target.style.borderColor = "#FF2E63";
                        e.target.style.boxShadow = "0 0 8px #FF2E63";
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = "#555";
                        e.target.style.boxShadow = "none";
                      }}
                    />
                  </FormControl>
                  <FormMessage className="mt-1 text-custom-highlight" />
                </FormItem>
              )}
            />
          ))}

          <FormField
            control={form.control}
            name="static"
            render={({ field }) => (
              <FormItem className="flex items-end justify-between gap-4 rounded-md p-2">
                <div className="space-y-0.5">
                  <FormLabel className="text-base text-custom-text-primary">
                    {fieldLabels.static}
                  </FormLabel>
                  <FormMessage className="text-custom-highlight" />
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    id="static"
                    className="cursor-pointer data-[state=checked]:bg-custom-primary data-[state=unchecked]:bg-gray-500"
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        <div className="mt-10">
          <Button
            type="submit"
            className="w-full py-3 font-semibold rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed bg-custom-primary text-custom-text-primary hover:bg-custom-accent cursor-pointer"
            disabled={loading}
          >
            {loading ? <Loader /> : "Submit"}
          </Button>
        </div>
      </form>
    </Form>
  );
}

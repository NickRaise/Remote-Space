"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useUserStore } from "@/store/userStore";
import { CreateAvatarAPI } from "@/lib/apis";
import { CreateAvatarSchema } from "@repo/common/api-types";
import { toast } from "sonner";
import { useState } from "react";
import Loader from "./loader";

const avatarSchema = z.object({
  name: z.string().min(1, "Name is required"),
  standingDown: z.string().url(),
  walkingDown1: z.string().url(),
  walkingDown2: z.string().url(),
  standingLeft: z.string().url(),
  walkingLeft1: z.string().url(),
  walkingLeft2: z.string().url(),
  standingRight: z.string().url(),
  walkingRight1: z.string().url(),
  walkingRight2: z.string().url(),
  standingUp: z.string().url(),
  walkingUp1: z.string().url(),
  walkingUp2: z.string().url(),
});

const fieldLabels: Record<keyof z.infer<typeof avatarSchema>, string> = {
  name: "Name",
  standingDown: "Standing Down URL",
  walkingDown1: "Walking Down 1 URL",
  walkingDown2: "Walking Down 2 URL",
  standingLeft: "Standing Left URL",
  walkingLeft1: "Walking Left 1 URL",
  walkingLeft2: "Walking Left 2 URL",
  standingRight: "Standing Right URL",
  walkingRight1: "Walking Right 1 URL",
  walkingRight2: "Walking Right 2 URL",
  standingUp: "Standing Up URL",
  walkingUp1: "Walking Up 1 URL",
  walkingUp2: "Walking Up 2 URL",
};

export default function AvatarCreationForm() {
  const token = useUserStore((state) => state.userToken);
  const [loading, setLoading] = useState<boolean>(false);

  const form = useForm<z.infer<typeof avatarSchema>>({
    resolver: zodResolver(avatarSchema),
    defaultValues: {
      name: "",
      standingDown: "",
      walkingDown1: "",
      walkingDown2: "",
      standingLeft: "",
      walkingLeft1: "",
      walkingLeft2: "",
      standingRight: "",
      walkingRight1: "",
      walkingRight2: "",
      standingUp: "",
      walkingUp1: "",
      walkingUp2: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof avatarSchema>) => {
    console.log("Avatar Data:", data);
    if (!token) return;
    try {
      setLoading(true);
      const { name, ...imageUrls } = data;
      const avatarData: z.infer<typeof CreateAvatarSchema> = {
        name,
        imageUrls,
      };
      const response = await CreateAvatarAPI(token, avatarData);
      if (response.status === 200) {
        toast("Avatar creation successful!");
        form.reset();
      } else {
        throw Error;
      }
    } catch (err) {
      console.log(err);
      toast("avatar creation failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full max-w-7xl px-4 lg:px-0"
      >
        <h1 className="text-3xl font-semibold text-center text-custom-text-primary my-5">
          Create Avatar
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Object.entries(avatarSchema.shape).map(([fieldName]) => (
            <FormField
              key={fieldName}
              control={form.control}
              name={fieldName as keyof z.infer<typeof avatarSchema>}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-medium text-custom-text-primary">
                    {fieldLabels[field.name]}
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter value"
                      {...field}
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
        </div>

        <div className="mt-10">
          <Button
            type="submit"
            className="w-full py-3 font-semibold rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed bg-custom-primary text-custom-text-primary hover:bg-custom-accent cursor-pointer"
            disabled={loading}
          >
            {!loading ? "Submit" : <Loader />}
          </Button>
        </div>
      </form>
    </Form>
  );
}

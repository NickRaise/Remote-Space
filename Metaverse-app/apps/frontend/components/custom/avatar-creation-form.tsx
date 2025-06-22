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
import { UploadFileField } from "../sections/UploadFileField";
import { IMAGE_FILE } from "@/lib/types";
import { UploadToCloudinary } from "@/cloudinary";
import { CLOUDINARY_AVATAR_FOLDER } from "@/lib/constant";

const avatarSchema = z.object({
  name: z.string().min(1, "Name is required"),
  standingDown: IMAGE_FILE,
  walkingDown1: IMAGE_FILE,
  walkingDown2: IMAGE_FILE,
  standingLeft: IMAGE_FILE,
  walkingLeft1: IMAGE_FILE,
  walkingLeft2: IMAGE_FILE,
  standingRight: IMAGE_FILE,
  walkingRight1: IMAGE_FILE,
  walkingRight2: IMAGE_FILE,
  standingUp: IMAGE_FILE,
  walkingUp1: IMAGE_FILE,
  walkingUp2: IMAGE_FILE,
});

const fieldLabels: Record<keyof z.infer<typeof avatarSchema>, string> = {
  name: "Name",
  standingDown: "Standing Down",
  walkingDown1: "Walking Down Frame 1",
  walkingDown2: "Walking Down Frame 2",
  standingLeft: "Standing Left",
  walkingLeft1: "Walking Left Frame 1",
  walkingLeft2: "Walking Left Frame 2",
  standingRight: "Standing Right",
  walkingRight1: "Walking Right Frame 1",
  walkingRight2: "Walking Right Frame 2",
  standingUp: "Standing Up",
  walkingUp1: "Walking Up Frame 1",
  walkingUp2: "Walking Up Frame 2",
};

export default function AvatarCreationForm() {
  const token = useUserStore((state) => state.userToken);
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof avatarSchema>>({
    resolver: zodResolver(avatarSchema),
    defaultValues: {
      name: "",
    },
  });

  const uploadAvatars = async (
    data: z.infer<typeof avatarSchema>
  ): Promise<z.infer<typeof CreateAvatarSchema>> => {
    const { name, ...images } = data;

    const entries = Object.entries(images);

    const uploadedImages = await Promise.all(
      entries.map(async ([key, file]) => {
        if (!(file instanceof File)) {
          throw new Error(`Expected File for ${key}, got ${typeof file}`);
        }

        const url = await UploadToCloudinary(file, CLOUDINARY_AVATAR_FOLDER);

        if (!url) {
          throw new Error(`Upload failed for ${key}`);
        }

        return [key, url];
      })
    );

    const imageUrls = Object.fromEntries(uploadedImages);

    return {
      name,
      imageUrls,
    };
  };

  const onSubmit = async (data: z.infer<typeof avatarSchema>) => {
    console.log(data);
    if (!token) return;
    try {
      setLoading(true);
      const avatarData = await uploadAvatars(data);
      const response = await CreateAvatarAPI(token, avatarData);
      if (response.status === 200) {
        toast("Avatar creation successful!");
        form.reset();
        window.location.reload();
      } else {
        throw Error;
      }
    } catch (err) {
      console.log(err);
      toast("Avatar creation failed");
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          {Object.entries(avatarSchema.shape).map(([fieldName]) => (
            <FormField
              key={fieldName}
              control={form.control}
              name={fieldName as keyof z.infer<typeof avatarSchema>}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-medium text-custom-text-primary">
                    {fieldLabels[fieldName as keyof typeof fieldLabels]}
                  </FormLabel>
                  <FormControl>
                    {fieldName === "name" ? (
                      <Input
                        {...field}
                        value={field.value as string}
                        placeholder="Enter name"
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
                    ) : (
                      <UploadFileField
                        field={{
                          value:
                            field.value instanceof File
                              ? field.value
                              : undefined,
                          onChange: field.onChange,
                        }}
                      />
                    )}
                  </FormControl>
                  <FormMessage className="mt-1 text-custom-highlight block min-h-[1.25rem]" />
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

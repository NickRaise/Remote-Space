"use client";
import { z } from "zod";
import { cn } from "@/lib/utils";
import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { buttonVariants } from "../ui/button";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const formSchema = z.object({
  username: z.string().min(3).max(50),
  password: z.string(),
});

const AuthForm = () => {
  const [isLogin, setIsLogin] = useState<boolean>(true);

  const toggleAuthType = () => {
    setIsLogin((type) => !type);
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
  }

  return (
    <>
      <div
        className={cn(
          buttonVariants({ variant: "ghost" }),
          "absolute right-4 top-4 md:right-10 md:top-10 cursor-pointer font-semibold border"
        )}
        onClick={toggleAuthType}
      >
        {isLogin ? "Register" : "Login"}
      </div>

      <div className="h-screen w-full flex items-center justify-center">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6 w-full max-w-md mx-auto p-6 bg-white dark:bg-zinc-900 rounded-lg shadow-md"
          >
            <h1 className="text-2xl font-semibold text-center">
              {isLogin ? "Login" : "Register"}
            </h1>

            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter a username"
                      {...field}
                      className="w-full"
                    />
                  </FormControl>
                  <FormDescription>This name must be unique.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Enter your password"
                      {...field}
                      className="w-full"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full cursor-pointer">
              {isLogin ? "Login" : "Register"}
            </Button>
          </form>
        </Form>
      </div>
    </>
  );
};

export default AuthForm;

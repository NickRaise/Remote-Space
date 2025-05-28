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
import { IAuthParams } from "@/lib/types/apiTypes";
import { LoginUserAPI, RegisterUserAPI } from "@/lib/apis";
import { toast } from "sonner";
import Loader from "./loader";

const formSchema = z.object({
  username: z
    .string()
    .min(3, {
      message: "Username length should be between 3 and 30 characters",
    })
    .max(30),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" }),
});

const AuthForm = () => {
  const [isLogin, setIsLogin] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const toggleAuthType = () => {
    setIsLogin((type) => !type);
    setErrorMessage(null);
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    setErrorMessage(null);
    if (isLogin) {
      handleLoginUser(values);
    } else {
      handleRegisterUser(values);
    }
  }

  const handleRegisterUser = async (values: IAuthParams) => {
    try {
      const result = await RegisterUserAPI(values);
      if (result.status === 200) {
        toast("Account created successfully. Please login now.");
        setIsLogin(true);
        form.reset();
      }
    } catch (err: any) {
      if (err.response?.status === 400) {
        setErrorMessage("User already exists.");
      } else {
        setErrorMessage("Registration failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLoginUser = async (values: IAuthParams) => {
    try {
      const result = await LoginUserAPI(values);
      if (result.status === 200) {
        toast("Login successful.");
        form.reset();
      }
    } catch (err: any) {
      if (err.response?.status === 403) {
        setErrorMessage("Invalid username or password.");
      } else {
        setErrorMessage("Login failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

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
                  </FormControl>{" "}
                  {!isLogin && (
                    <FormDescription>This name must be unique.</FormDescription>
                  )}
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

            {errorMessage && (
              <p className="text-sm text-red-500 text-center -mt-4">
                {errorMessage}
              </p>
            )}

            <Button
              type="submit"
              className="w-full cursor-pointer"
              disabled={loading}
            >
              {loading ? <Loader /> : isLogin ? "Login" : "Register"}
            </Button>
          </form>
        </Form>
      </div>
    </>
  );
};

export default AuthForm;

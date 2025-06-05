"use client";
import { z } from "zod";
import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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
import Logo from "./logo";

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
      <div className="absolute top-6 lg:right-4 flex justify-around max-lg:w-full">
        <div className="lg:hidden">
          <Logo />
        </div>
        <button
          className="px-4 py-2 text-sm font-medium border border-custom-primary text-custom-primary rounded-full hover:bg-custom-primary hover:text-white transition cursor-pointer"
          onClick={toggleAuthType}
        >
          {isLogin ? "Register" : "Login"}
        </button>
      </div>

      <div className="h-screen w-full flex items-center justify-center custom-bg-gradient">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6 w-full max-w-md mx-auto p-8 rounded-lg shadow-lg bg-custom-bg-dark-1"
          >
            <h1 className="text-3xl font-semibold text-center text-custom-text-primary">
              {isLogin ? "Login" : "Register"}
            </h1>

            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="mb-1 font-medium text-custom-text-primary">
                    Username
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter a username"
                      {...field}
                      className="w-full rounded-md border border-gray-600 bg-custom-bg-dark-2 px-3 py-2 text-custom-text-primary transition focus:outline-none"
                      style={{
                        borderColor: "transparent",
                        boxShadow: `0 0 0 2px transparent`,
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = "#FF2E63"; // Accent pink
                        e.target.style.boxShadow = "0 0 8px #FF2E63";
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = "#555"; // fallback border color
                        e.target.style.boxShadow = "none";
                      }}
                    />
                  </FormControl>
                  {!isLogin && (
                    <FormDescription className="text-custom-text-secondary text-[0.85rem]">
                      This name must be unique.
                    </FormDescription>
                  )}
                  <FormMessage className="mt-1 text-custom-highlight" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="mb-1 font-medium text-custom-text-primary">
                    Password
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Enter your password"
                      {...field}
                      className="w-full rounded-md border border-gray-600 bg-custom-bg-dark-2 px-3 py-2 text-custom-text-primary transition focus:outline-none"
                      onFocus={(e) => {
                        e.target.style.borderColor = "#FF2E63"; // Accent pink
                        e.target.style.boxShadow = "0 0 8px #FF2E63";
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = "#555"; // fallback border color
                        e.target.style.boxShadow = "none";
                      }}
                    />
                  </FormControl>
                  <FormMessage className="mt-1 text-custom-highlight" />
                </FormItem>
              )}
            />

            {errorMessage && (
              <p className="text-sm text-custom-accent text-center -mt-4">
                {errorMessage}
              </p>
            )}

            <Button
              type="submit"
              className="w-full py-3 font-semibold rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed bg-custom-primary text-custom-text-primary hover:bg-custom-accent cursor-pointer"
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

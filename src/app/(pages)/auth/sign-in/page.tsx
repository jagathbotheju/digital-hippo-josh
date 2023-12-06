"use client";
import { Icons } from "@/components/Icons";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { ArrowRight, Loader2 } from "lucide-react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { redirect, useRouter } from "next/navigation";
import { SignUp } from "../sign-up/page";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useEffect, useState } from "react";
import { signIn, useSession } from "next-auth/react";
import { toast } from "react-toastify";

const signInSchema = z.object({
  email: z
    .string({
      required_error: "Email is required",
    })
    .email({ message: "Invalid Email Address" }),
  password: z.string({
    required_error: "Password is required",
  }),
});

export type SignIn = z.infer<typeof signInSchema>;

const SignInPage = () => {
  const { data: session } = useSession();
  const [isPending, setIsPending] = useState(false);
  const router = useRouter();
  const form = useForm<SignUp>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (formData: SignIn) => {
    setIsPending(true);
    signIn("credentials", {
      ...formData,
      //redirect: false,
      callbackUrl: "/",
    })
      .then((cb) => {
        console.log(cb);
        setIsPending(false);
        if (cb?.ok && !cb?.error) {
          //router.push("/");
          toast.success("Login Successful");
        }
        if (cb?.error) {
          toast.error(cb.error);
          router.push("/unauthorized");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    if (session && session.user) {
      router.back();
    }
  }, [session, router]);

  return (
    <div className="container relative flex pt-20 flex-col items-center justify-center lg:px-0">
      <div className="mx-auto w-full flex flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col items-center space-y-2 text-center">
          <Icons.logo className="h-20 w-20" />
          <h1 className="text-2xl font-bold">Sign In</h1>
        </div>

        {/* sign-in form */}
        <div className="w-full">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-8 w-full"
            >
              {/* email */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* password */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="password"
                        type="password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* type */}

              {/* submit button */}
              <Button disabled={isPending} type="submit" className="w-full">
                {isPending && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin text-secondary" />
                )}
                Submit
              </Button>
            </form>
          </Form>
        </div>

        <Link
          className={buttonVariants({
            variant: "link",
            className: "gap-1.5 mt-5",
          })}
          href="/auth/sign-up"
        >
          New here ? Sign-Up
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
};

export default SignInPage;

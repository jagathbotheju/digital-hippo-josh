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
import * as z from "zod";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Type } from "@prisma/client";
import { useTransition } from "react";
import { signUpUser } from "@/lib/serverActions";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

const signUpSchema = z.object({
  name: z.string().min(1, {
    message: "Name is required",
  }),
  email: z
    .string({
      required_error: "Email is required",
    })
    .email({ message: "Invalid Email Address" }),
  password: z.string().min(8, {
    message: "Password must be at least 8 chars long",
  }),
  type: z.string({
    required_error: "User type is required",
  }),
});

export type SignUp = z.infer<typeof signUpSchema>;

const SignUpPage = () => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const form = useForm<SignUp>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      type: "",
    },
  });

  const onSubmit = (formData: SignUp) => {
    startTransition(() => {
      signUpUser(formData).then((response) => {
        if (response.success) {
          toast.info("Check your email and verify email address");
          console.log(response.data);
          form.reset();
          router.push("/auth/sign-in");
        }
        if (!response.success) {
          toast.error(response.message);
        }
      });
    });
  };

  return (
    <div className="container relative flex pt-20 flex-col items-center justify-center lg:px-0">
      <div className="mx-auto w-full flex flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 items-center">
          <Icons.logo className="h-20 w-20" />
          <h1 className="text-2xl font-bold">Create an Account</h1>
        </div>

        {/* sign-up form */}
        <div className="w-full">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-8 w-full"
            >
              {/* name */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

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
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>User Type</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Your Type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value={Type.SELLER}>
                          I am here to Sell
                        </SelectItem>
                        <SelectItem value={Type.BUYER}>
                          I am here to Buy
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

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
          href="/auth/sign-in"
        >
          Already have an Account? Sign-In
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
};

export default SignUpPage;

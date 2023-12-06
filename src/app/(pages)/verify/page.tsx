"use client";
import { Button } from "@/components/ui/button";
import { verifyJwt } from "@/lib/jwt";
import { verifyUser } from "@/lib/serverActions";
import { User } from "@prisma/client";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useTransition } from "react";

interface Props {
  searchParams: {
    token: string;
  };
}

const VerifyPage = () => {
  const router = useRouter();
  const [user, setUser] = useState<User | null>();
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState<string>("");
  const [isPending, startTransition] = useTransition();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  useEffect(() => {
    if (token) {
      startTransition(async () => {
        const user = (await verifyJwt(token)) as User;

        if (user) {
          setUser(user);
          verifyUser(user.id)
            .then((res) => {
              if (res.success) {
                setVerified(true);
              } else {
                setError(res.message as string);
              }
            })
            .catch((error): any => {
              setError(error?.message);
            });
        }
      });
    }
  }, [token]);

  return (
    <div className="container flex pt-20 flex-col items-center justify-center mx-auto">
      <div className="relative h-40 w-40">
        <Image src="/hippo-email-sent.png" fill alt="email verified" />
        <span className="loading loading-spinner text-primary"></span>
      </div>

      <h2 className="font-bold text-2xl">Verifying user {user?.name}...</h2>

      {isPending ? (
        <Loader2 className="mr-2 h-10 w-10 animate-spin my-5" />
      ) : error ? (
        error
      ) : (
        verified && (
          <div className="flex flex-col gap-4">
            <p className="text-green-700 font-semibold text-lg">
              User Validation Successful, Please Login
            </p>
            <Button onClick={() => router.push("/auth/sign-in")}>Login</Button>
          </div>
        )
      )}
    </div>
  );
};

export default VerifyPage;

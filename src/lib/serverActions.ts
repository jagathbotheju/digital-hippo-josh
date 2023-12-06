"use server";
import { SignUp } from "@/app/(pages)/auth/sign-up/page";
import bcrypt from "bcrypt";
import prisma from "./prismadb";
import { Type } from "@prisma/client";
import { signJwtTokens } from "./jwt";
import { sendMail } from "./mail";

export const verifyUser = async (userid: string) => {
  try {
    const user = await prisma.user.update({
      where: { id: userid },
      data: {
        emailVerified: new Date(),
      },
    });

    if (!user) {
      return {
        success: false,
        message: "User verification failed",
      };
    }

    return {
      success: true,
      data: user,
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message: "Internal Server Error",
    };
  }
};

export const signUpUser = async ({ name, email, password, type }: SignUp) => {
  try {
    const exist = await prisma.user.findUnique({
      where: { email },
    });
    if (exist) {
      return {
        success: false,
        message: "Email address already inuse, please choose another address",
      };
    }
    const hashedPw = await bcrypt.hash(password, 10);
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        hashedPassword: hashedPw,
        type: type as Type,
      },
    });
    if (!newUser) {
      return {
        success: false,
        message: "Unable to create user, try again later.",
      };
    }

    const { hashedPassword, ...noPasswordUser } = newUser;

    //send verification token
    const secretKey = process.env.JWT_SECRET_KEY as string;
    const BASE_URL = process.env.NEXTAUTH_URL as string;
    const token = await signJwtTokens(noPasswordUser, secretKey, {
      expiresIn: "1d",
    });
    console.log("sendMail", token);
    await sendMail({
      to: noPasswordUser.email as string,
      name: noPasswordUser.name as string,
      subject: "Verify Email Address",
      url: `${BASE_URL}/verify?token=${token}`,
    });

    return {
      success: true,
      data: noPasswordUser,
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message: "Internal Server Error",
    };
  }
};

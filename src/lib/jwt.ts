"use server";
import jwt, { JwtPayload } from "jsonwebtoken";

interface SignOptions {
  expiresIn?: string | number;
}

const DEFAULT_SIGN_OPTION: SignOptions = {
  expiresIn: "1h",
};

export async function signJwtTokens(
  payload: JwtPayload,
  key: string,
  options: SignOptions
) {
  const jwt_token = jwt.sign(payload, key, options);
  return jwt_token;
}

export async function verifyJwt(token: string) {
  try {
    const decoded_jwt = jwt.verify(token, process.env.JWT_SECRET_KEY as string);
    return decoded_jwt as JwtPayload;
  } catch (error) {
    console.log(error);
    return null;
  }
}

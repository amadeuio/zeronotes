// Mock jose module to avoid ESM issues with Jest
export class SignJWT {
  private payload: any;

  constructor(payload: any) {
    this.payload = payload;
  }

  setProtectedHeader(_header: any): this {
    return this;
  }

  setIssuedAt(): this {
    return this;
  }

  setExpirationTime(_time: string): this {
    return this;
  }

  async sign(_secret: Uint8Array | string): Promise<string> {
    // Return a mock JWT token
    const header = Buffer.from(
      JSON.stringify({ alg: "HS256", typ: "JWT" })
    ).toString("base64");
    const payload = Buffer.from(JSON.stringify(this.payload)).toString(
      "base64"
    );
    const signature = "mock-signature";
    return `${header}.${payload}.${signature}`;
  }
}

export async function jwtVerify(
  token: string,
  _secret: Uint8Array | string
): Promise<any> {
  // Parse the token and return the payload
  const parts = token.split(".");
  if (parts.length !== 3) {
    throw new Error("Invalid token");
  }

  const payload = JSON.parse(Buffer.from(parts[1], "base64").toString());

  return {
    payload,
    protectedHeader: { alg: "HS256", typ: "JWT" },
  };
}

export default {
  SignJWT,
  jwtVerify,
};

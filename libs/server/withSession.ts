import { IronSessionOptions } from "iron-session";
import { withIronSessionApiRoute, withIronSessionSsr } from "iron-session/next";
import { NextApiHandler } from "next";

declare module "iron-session" {
  interface IronSessionData {
    user?: {
      id: number;
    };
  }
}

const sessionOption: IronSessionOptions = {
  password: process.env.PASSWORD!,
  cookieName: "eCommerce",
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
  },
};

export const withSessionAPI = (withHandler: NextApiHandler) => {
  return withIronSessionApiRoute(withHandler, sessionOption);
};

export const withSsrSession = (handler: any) => {
  return withIronSessionSsr(handler, sessionOption);
};

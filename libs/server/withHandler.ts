import { NextApiRequest, NextApiResponse } from "next";

export interface ResponseType {
  ok: boolean;
  [key: string]: any;
}

type Method = "GET" | "POST" | "DELETE";

type Handler = (
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) => Promise<void>;

type ConfigType = {
  method: Method[];
  handler: Handler;
  isPrivate?: boolean;
};

const withHandler = ({ handler, method, isPrivate = true }: ConfigType) => {
  return async function (
    req: NextApiRequest,
    res: NextApiResponse<ResponseType>
  ) {
    try {
      if (req.method && !method.includes(req.method as Method)) {
        return res
          .status(405)
          .json({ ok: false, error: "Request method is incorrect." });
      }
      if (!req.session?.user && isPrivate) {
        return res.status(401).json({ ok: false, error: "Please Login." });
      }
      return await handler(req, res);
    } catch (e) {
      console.log(e);
      return res.status(500).json({ ok: false, error: "Server not working" });
    }
  };
};

export default withHandler;

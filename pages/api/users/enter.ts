import withHandler, { ResponseType } from "@libs/server/withHandler";
import { NextApiRequest, NextApiResponse } from "next";

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) => {
  return res.json({ ok: true });
};

export default withHandler({
  handler,
  method: ["POST"],
  isPrivate: false,
});

import client from "@libs/server/client";
import withHandler, { ResponseType } from "@libs/server/withHandler";
import { NextApiRequest, NextApiResponse } from "next";

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) => {
  try {
    const { token } = req.body;
    const foundToken = await client.token.findUnique({
      where: {
        payload: token,
      },
      select: {
        id: true,
        userId: true,
      },
    });

    if (!foundToken) {
      return res.json({ ok: false, error: "Could not found user." });
    }

    await client.token.deleteMany({
      where: {
        userId: foundToken.userId,
      },
    });
    return res.status(201).json({ ok: true });
  } catch (e) {
    console.log(`${e} Error in handler`);
    return res.status(500).json({ ok: false, error: "Error in handler" });
  }
};

export default withHandler({
  handler,
  method: ["POST"],
  isPrivate: false,
});

import client from "@libs/server/client";
import withHandler, { ResponseType } from "@libs/server/withHandler";
import { withSessionAPI } from "@libs/server/withSession";
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
    } else {
      req.session.user = {
        id: foundToken.userId,
      };
    }
    await req.session.save();
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

export default withSessionAPI(
  withHandler({
    handler,
    method: ["POST"],
    isPrivate: false,
  })
);

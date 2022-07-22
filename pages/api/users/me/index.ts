import client from "@libs/server/client";
import withHandler, { ResponseType } from "@libs/server/withHandler";
import { withSessionAPI } from "@libs/server/withSession";
import { NextApiRequest, NextApiResponse } from "next";

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) => {
  try {
    const {
      session: { user },
    } = req;

    if (req.session.user === undefined) {
      return res.json({ ok: false });
    }

    const existUser = await client.user.findUnique({
      where: {
        id: user?.id,
      },
      select: {
        username: true,
        id: true,
        avatar: true,
        email: true,
        bio: true,
        website: true,
        createdAt: true,
      },
    });

    if (!existUser) {
      return res.json({ ok: false, error: "Could not found user." });
    }
    return res
      .status(200)
      .json({ ok: true, user: existUser ? existUser : null });
  } catch (e) {
    console.log(`${e} Error in handler`);
    return res.status(500).json({ ok: false, error: "Error in handler" });
  }
};

export default withSessionAPI(
  withHandler({
    handler,
    method: ["GET"],
    isPrivate: false,
  })
);

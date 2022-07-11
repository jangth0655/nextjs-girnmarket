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
      query: { id },
      session: { user },
    } = req;
    const existPost = await client.post.findFirst({
      where: {
        userId: user?.id,
        id: Number(id),
      },
      select: {
        id: true,
      },
    });
    if (!existPost) {
      return res
        .status(404)
        .json({ ok: false, error: "Could not found post." });
    } else {
      await client.post.delete({
        where: {
          id: existPost.id,
        },
      });
    }
    return res.status(200).json({ ok: true });
  } catch (e) {
    console.log(`${e} Error in handler`);
    return res.status(500).json({ ok: false, error: "Error in handler" });
  }
};

export default withSessionAPI(
  withHandler({
    handler,
    method: ["GET"],
    isPrivate: true,
  })
);

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
      query: { id, commentId },
    } = req;

    const existPost = await client.post.findUnique({
      where: {
        id: Number(id),
      },
      select: {
        id: true,
      },
    });

    if (!existPost) {
      return res.status(400).json({ ok: false, error: "Could not found" });
    }

    const isMine = Boolean(
      await client.comment.findFirst({
        where: {
          id: Number(commentId),
          userId: user?.id,
        },
        select: {
          id: true,
        },
      })
    );

    return res.status(200).json({ ok: true, isMine });
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

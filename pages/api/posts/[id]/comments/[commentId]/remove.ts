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

    console.log(user?.id);

    const existPost = await client.post.findUnique({
      where: {
        id: Number(id),
      },
      select: {
        id: true,
      },
    });
    if (!existPost) {
      return res
        .status(400)
        .json({ ok: false, error: "Could not found post." });
    }
    const comment = await client.comment.findFirst({
      where: {
        userId: user?.id,
        id: Number(commentId),
      },
      select: {
        id: true,
      },
    });
    if (!comment) {
      return res
        .status(400)
        .json({ ok: false, error: "Could not found comment." });
    }
    await client.comment.delete({
      where: {
        id: Number(commentId),
      },
    });
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

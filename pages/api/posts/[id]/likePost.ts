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
      query: { id },
    } = req;

    const existPost = await client.likeComment.findFirst({
      where: {
        postId: Number(id),
        userId: user?.id,
      },
      select: {
        id: true,
      },
    });

    if (existPost) {
      await client.likeComment.delete({
        where: {
          id: existPost.id,
        },
      });
      return res.json({ ok: true });
    }

    await client.likeComment.create({
      data: {
        user: {
          connect: {
            id: user?.id,
          },
        },
        post: {
          connect: {
            id: Number(id),
          },
        },
      },
    });
    return res.json({ ok: true });
  } catch (e) {
    console.log(`${e} Error in handler`);
    return res.status(500).json({ ok: false, error: "Error in handler" });
  }
};

export default withSessionAPI(
  withHandler({
    handler,
    method: ["POST"],
    isPrivate: true,
  })
);

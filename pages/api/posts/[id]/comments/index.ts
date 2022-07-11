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
      body: { answer },
      session: { user },
      query: { id },
    } = req;

    const existPost = await client.post.findFirst({
      where: {
        id: Number(id),
      },
      select: {
        id: true,
        userId: true,
      },
    });
    if (!existPost) {
      return res
        .status(404)
        .json({ ok: false, error: "Could not found post." });
    }
    const newComment = await client.comment.create({
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
        answer,
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
    isPrivate: true,
  })
);

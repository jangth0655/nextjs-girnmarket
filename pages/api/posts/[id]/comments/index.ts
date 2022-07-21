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
      query: { id, page = 1 },
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

    const pageSize = 10;
    if (req.method === "GET") {
      const postComments = await client.post.findFirst({
        where: {
          id: existPost.id,
        },
        select: {
          comments: {
            select: {
              answer: true,
              id: true,
              createdAt: true,
              user: {
                select: {
                  username: true,
                  id: true,
                  avatar: true,
                },
              },
            },
            take: pageSize,
            skip: (Number(page) - 1) * pageSize,
          },
        },
      });
      return res.status(200).json({ ok: true, postComments });
    }

    if (req.method === "POST") {
      const newComment = await client.comment.create({
        data: {
          user: {
            connect: {
              id: user?.id,
            },
          },
          post: {
            connect: {
              id: existPost.id,
            },
          },
          answer,
        },
      });
    }

    return res.status(201).json({ ok: true });
  } catch (e) {
    console.log(`${e} Error in handler`);
    return res.status(500).json({ ok: false, error: "Error in handler" });
  }
};

export default withSessionAPI(
  withHandler({
    handler,
    method: ["GET", "POST"],
    isPrivate: true,
  })
);

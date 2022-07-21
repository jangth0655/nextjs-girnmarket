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
      body: { question, imageUrl },
      session: { user },
      query: { id, page = 1 },
    } = req;

    const pageSize = 5;
    const pageNumber = Number(page);
    if (req.method === "GET") {
      const post = await client.post.findUnique({
        where: {
          id: Number(id),
        },
        include: {
          user: {
            select: {
              id: true,
              username: true,
              avatar: true,
            },
          },
          comments: {
            select: {
              answer: true,
              createdAt: true,
              id: true,
              user: {
                select: {
                  id: true,
                  username: true,
                  avatar: true,
                },
              },
            },
            take: pageSize,
            skip: (pageNumber - 1) * pageSize,
          },
          _count: {
            select: {
              comments: true,
              likePost: true,
            },
          },
        },
      });
      if (!post) {
        return res
          .status(400)
          .json({ ok: false, error: "Could not found post" });
      }

      const isLikePost = Boolean(
        await client.likeComment.findFirst({
          where: {
            postId: post.id,
            userId: user?.id,
          },
          select: {
            id: true,
          },
        })
      );

      const isMine = post.userId === user?.id;
      return res.status(200).json({ ok: true, post, isMine, isLikePost });
    }

    if (req.method === "POST") {
      const currentPost = await client.post.findUnique({
        where: {
          id: Number(id),
        },
        select: {
          question: true,
          id: true,
        },
      });
      if (question) {
        const newPost = await client.post.update({
          where: {
            id: currentPost?.id,
          },
          data: {
            question,
          },
        });
        return res.status(201).json({ ok: true, newPost });
      }
      if (imageUrl) {
        const newPost = await client.post.update({
          where: {
            id: currentPost?.id,
          },
          data: {
            image: imageUrl,
          },
        });
        return res.status(201).json({ ok: true, newPost });
      }
    }
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

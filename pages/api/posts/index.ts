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
      body: { question, imageId },
      query: { page = 1 },
    } = req;

    const pageSize = 5;
    const pageNumber = Number(page);
    if (req.method === "GET") {
      const posts = await client.post.findMany({
        include: {
          user: {
            select: {
              id: true,
              avatar: true,
              username: true,
            },
          },
          _count: {
            select: {
              comments: true,
              likeComments: true,
            },
          },
        },
        take: pageSize,
        skip: (pageNumber - 1) * pageSize,
        orderBy: {
          createdAt: "desc",
        },
      });

      return res.status(200).json({ ok: true, posts });
    }

    if (req.method === "POST") {
      const post = await client.post.create({
        data: {
          question,
          user: {
            connect: {
              id: user?.id,
            },
          },
          ...(imageId && { image: imageId }),
        },
      });
      return res.status(201).json({ ok: true });
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

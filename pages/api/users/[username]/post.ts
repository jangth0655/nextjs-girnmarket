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
      query: { username, page = 1 },
    } = req;
    const existUser = await client.user.findUnique({
      where: {
        username: username + "",
      },
      select: {
        id: true,
      },
    });
    if (!existUser) {
      return res
        .status(404)
        .json({ ok: false, error: "Could not found user." });
    }

    const pageSize = 10;
    const posts = await client.user.findFirst({
      where: {
        username: username + "",
      },
      select: {
        username: true,
        id: true,
        avatar: true,
        posts: {
          select: {
            _count: true,
            likePost: true,
            id: true,
            question: true,
            image: true,
          },
          take: pageSize,
          skip: (+page - 1) * pageSize,
        },
      },
    });
    return res.status(200).json({ ok: true, posts });
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

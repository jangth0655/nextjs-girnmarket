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

    const { email, username, avatarId, bio, website } = req.body;

    console.log(req.body.username);

    const confirmUser = username ? { username } : email && { email };

    const currentUser = await client.user.findUnique({
      where: {
        id: user?.id,
      },
      select: {
        username: true,
        email: true,
        avatar: true,
      },
    });

    const existUser = await client.user.findUnique({
      where: confirmUser,
      select: {
        username: true,
        email: true,
      },
    });

    if (email && email !== currentUser?.email) {
      if (email === existUser?.email) {
        return res.json({ ok: false, error: "이메일이 이미 존재합다." });
      }
      await client.user.update({
        where: {
          id: user?.id,
        },
        data: {
          email,
        },
      });
    }

    if (username && username !== currentUser?.username) {
      if (username === existUser?.username) {
        return res.json({ ok: false, error: "username이 이미 존재합니다." });
      }
      await client.user.update({
        where: {
          id: user?.id,
        },
        data: {
          username,
        },
      });
    }

    if (bio) {
      await client.user.update({
        where: {
          id: user?.id,
        },
        data: {
          bio,
        },
      });
    }

    if (website) {
      await client.user.update({
        where: {
          id: user?.id,
        },
        data: {
          website,
        },
      });
    }

    if (avatarId && avatarId !== currentUser?.avatar) {
      await client.user.update({
        where: {
          id: user?.id,
        },
        data: {
          avatar: avatarId,
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
    method: ["POST"],
    isPrivate: true,
  })
);

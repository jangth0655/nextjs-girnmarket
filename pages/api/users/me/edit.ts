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

    const { email, username, avatarId, bio, webSite } = req.body;
    const currentUser = await client.user.findUnique({
      where: {
        id: user?.id,
      },
      select: {
        username: true,
        email: true,
      },
    });
    if (email && email !== currentUser?.email) {
      if (email === currentUser?.email) {
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
      return res.status(201).json({ ok: true });
    }
    if (username && username !== currentUser?.username) {
      if (username === currentUser?.username) {
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
      return res.status(201).json({ ok: true });
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

    if (webSite) {
      await client.user.update({
        where: {
          id: user?.id,
        },
        data: {
          webSite,
        },
      });
    }

    if (avatarId) {
      await client.user.update({
        where: {
          id: user?.id,
        },
        data: {
          avatar: avatarId,
        },
      });
    }
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

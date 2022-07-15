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
      query: { username },
    } = req;

    console.log(username);

    const user = await client.user.findUnique({
      where: {
        username: username + "",
      },
      select: {
        id: true,
      },
    });

    if (!user) {
      return res.json({ ok: false, error: "사용자를 찾을 수 없습니다." });
    } else {
      req.session.user = {
        id: user.id,
      };
    }
    await req.session.destroy();
    return res.status(201).json({ ok: true });
  } catch (e) {
    console.log(`${e} Error in handler`);
    return res.status(500).json({ ok: false, error: "Error in handler" });
  }
};

export default withSessionAPI(
  withHandler({
    handler,
    method: ["GET"],
    isPrivate: false,
  })
);

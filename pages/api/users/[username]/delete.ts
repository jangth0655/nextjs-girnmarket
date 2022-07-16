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
      session: { user },
    } = req;

    const existUser = await client.user.findUnique({
      where: {
        id: user?.id,
      },
      select: { id: true },
    });
    if (!existUser) {
      return res
        .status(400)
        .json({ ok: false, error: "Could not found user." });
    }
    const deleteUser = await client.user.delete({
      where: {
        id: existUser.id,
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
    method: ["POST"],
    isPrivate: false,
  })
);

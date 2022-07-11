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
      query: { id, reviewId },
    } = req;

    const existProduct = await client.product.findUnique({
      where: {
        id: Number(id),
      },
      select: {
        id: true,
      },
    });
    if (existProduct) {
      return res
        .status(400)
        .json({ ok: false, error: "Could not found product." });
    }
    const isMine = Boolean(
      await client.review.findFirst({
        where: {
          id: Number(reviewId),
          userId: user?.id,
        },
        select: {
          id: true,
        },
      })
    );
    return res.status(200).json({ ok: true, isMine });
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

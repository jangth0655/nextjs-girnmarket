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
      query: { id },
      body: { reviewId },
    } = req;

    const existProduct = await client.product.findFirst({
      where: {
        id: Number(id),
      },
      select: {
        id: true,
      },
    });
    if (!existProduct) {
      return res
        .status(400)
        .json({ ok: false, error: "Could not found product." });
    }

    const existReview = await client.review.findFirst({
      where: {
        userId: user?.id,
        id: Number(reviewId),
      },
      select: {
        id: true,
      },
    });
    if (!existReview) {
      return res
        .status(400)
        .json({ ok: false, error: "Could not found review." });
    }
    await client.review.delete({
      where: {
        id: existReview.id,
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
    isPrivate: true,
  })
);

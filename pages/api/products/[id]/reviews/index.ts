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
      body: { review },
      session: { user },
      query: { id },
    } = req;

    const existProduct = await client.product.findUnique({
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

    const newReview = await client.review.create({
      data: {
        user: {
          connect: {
            id: user?.id,
          },
        },
        product: {
          connect: {
            id: existProduct.id,
          },
        },
        review,
      },
    });
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

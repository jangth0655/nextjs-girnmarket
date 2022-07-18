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
      query: { id },
      session: { user },
    } = req;

    const { price, description, name, photoId, photoUrl } = req.body;

    const existProduct = await client.product.findFirst({
      where: {
        userId: user?.id,
        id: Number(id),
      },
      select: {
        id: true,
        price: true,
        description: true,
        name: true,
        photos: {
          select: {
            url: true,
          },
        },
      },
    });
    if (!existProduct) {
      return res
        .status(404)
        .json({ ok: false, error: "Could not found post." });
    }

    if (price && price !== existProduct.price) {
      await client.product.update({
        where: {
          id: Number(id),
        },
        data: {
          price,
        },
      });
    }

    if (name && name !== existProduct.name) {
      await client.product.update({
        where: {
          id: Number(id),
        },
        data: {
          name,
        },
      });
    }

    if (description && description !== existProduct.description) {
      await client.product.update({
        where: {
          id: Number(id),
        },
        data: {
          description,
        },
      });
    }

    if (photoId && photoUrl !== existProduct.photos[0].url) {
      const existPhoto = await client.photo.findUnique({
        where: {
          id: photoId,
        },
        select: {
          id: true,
        },
      });
      if (!existPhoto) {
        return res.json({ ok: false, error: "Could not found photo." });
      }
      await client.photo.delete({
        where: {
          id: photoId,
        },
      });
      await client.photo.create({
        data: {
          productId: Number(id),
          url: photoUrl,
        },
      });
    }

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

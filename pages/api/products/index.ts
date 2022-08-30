import client from "@libs/server/client";
import withHandler, { ResponseType } from "@libs/server/withHandler";
import { withSessionAPI } from "@libs/server/withSession";
import { NextApiRequest, NextApiResponse } from "next";

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) => {
  try {
    if (req.method === "GET") {
      const {
        query: { page = 1 },
      } = req;

      const pageSize = 10;
      const pageNumber = Number(page);

      const products = await client.product.findMany({
        include: {
          user: {
            select: {
              id: true,
              username: true,
              avatar: true,
            },
          },
          _count: {
            select: {
              favs: true,
            },
          },
          photos: {
            select: {
              url: true,
              id: true,
            },
          },
        },
        take: pageSize,
        skip: (pageNumber - 1) * pageSize,
      });

      if (!products) {
        return res
          .status(404)
          .json({ ok: false, error: "상품을 찾을 수 없습니다." });
      }
      return res.status(200).json({ ok: true, products });
    }

    if (req.method === "POST") {
      const {
        body: { name, price, description, productId },
        session: { user },
      } = req;
      console.log("uploadAPI", req.body);
      if (!productId) {
        return res.json({ ok: false, error: "Image is required." });
      }

      const product = await client.product.create({
        data: {
          name,
          price: price,
          description,
          user: {
            connect: {
              id: user?.id,
            },
          },
        },
      });

      if (!product) {
        return res
          .status(401)
          .json({ ok: false, error: "업로드 할 수 없습니다." });
      }

      let productPhoto;
      if (product && productId) {
        productPhoto = await client.photo.create({
          data: {
            url: productId,
            product: {
              connect: {
                id: product.id,
              },
            },
          },
        });
      }

      await res.revalidate("/");

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
    isPrivate: false,
  })
);

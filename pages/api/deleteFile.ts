import client from "@libs/server/client";
import withHandler, { ResponseType } from "@libs/server/withHandler";
import { withSessionAPI } from "@libs/server/withSession";
import { NextApiRequest, NextApiResponse } from "next";

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) => {
  try {
    const { body: imageId } = req;
    const response = await (
      await fetch(
        `https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUD_ACCOUNT_ID}/images/v1/${imageId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${process.env.CLOUD_API_TOKEN}`,
          },
        }
      )
    ).json();
    if (!response) {
      return res.status(500).json({ ok: false, error: "CloudFlare error" });
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
    method: ["DELETE"],
    isPrivate: true,
  })
);

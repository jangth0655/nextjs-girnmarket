import client from "@libs/server/client";
import withHandler, { ResponseType } from "@libs/server/withHandler";
import { withSessionAPI } from "@libs/server/withSession";
import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) => {
  try {
    const response = await (
      await axios({
        method: "POST",
        url: `https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUD_ACCOUNT_ID}/images/v2/direct_upload`,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.CLOUD_API_TOKEN}`,
        },
      })
    ).data;

    return res.json({ ok: true, ...response.result });
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

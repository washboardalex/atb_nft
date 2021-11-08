// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { ethers } from "ethers";
import type { NextApiRequest, NextApiResponse } from "next";
const key = process.env.PRIVATE_KEY;
const droplet = ethers.utils.parseEther(process.env.DRIP_RATE || "0");

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (!key || !droplet) {
    res.status(500).send("borked");
    return;
  }
  if (req.method === "POST") {
    const wallet = new ethers.Wallet(
      key,
      new ethers.providers.JsonRpcProvider(
        "https://polygon-mainnet.g.alchemy.com/v2/p6cOz2Sah7mM9TmEJDq4PEmYFGC_YoSO"
      )
    );

    const requesterBalance = await wallet.provider.getBalance(req.body.address);

    if (requesterBalance.eq(0) && (await wallet.getBalance()).gte(droplet)) {
      await wallet.sendTransaction({
        to: req.body.address,
        value: droplet,
      });
    } else {
      res.status(400).send("Faucet's dry, comrade");
    }
  }
}

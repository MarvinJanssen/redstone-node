import axios from "axios";
import mode from "../../../mode";
import { Broadcaster } from "../Broadcaster";
import { PriceDataSigned, SignedPricePackage } from "../../types";
import { Consola } from "consola";

const logger = require("../../utils/logger")("HttpBroadcaster") as Consola;

export class HttpBroadcaster implements Broadcaster {
  constructor(private readonly broadcasterURLs: string[] = [mode.broadcasterUrl]) { }

  async broadcast(prices: PriceDataSigned[]): Promise<void> {
    for (const url of this.broadcasterURLs) {
      logger.info(`Posting prices to ${url}`);
      await axios.post(url + '/prices', prices);
    }
  }

  async broadcastPricePackage(
    signedData: SignedPricePackage,
    providerAddress: string): Promise<void> {
    const body = {
      signature: signedData.signature,
      liteSignature: signedData.liteSignature,
      signerPubKey: signedData.signerPubKey,
      provider: providerAddress,
      ...signedData.pricePackage, // unpacking prices and timestamp
    };

    for (const url of this.broadcasterURLs) {
      logger.info(`Posting pacakages to ${url}`);
      await axios.post(url + '/packages', body);
    }
  }
}

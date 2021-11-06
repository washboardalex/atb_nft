import { Button, Image, Pane, Spinner, TextInput } from "evergreen-ui";
import React, { useEffect, useState } from "react";
import { ethers } from "ethers";

const nftAddress = "0x957f821cc9074a65caf17023f5a46a15727039c8";

function App() {
  const [privateKey, setPrivateKey] = useState("0xPRIVATE_KEY");
  const [loading, setLoading] = useState(true);
  const [nftURI, setNFTURI] = useState("https://placebear.com/300/300");

  useEffect(() => {
    const getNFT = async (key: string) => {
      const wallet = new ethers.Wallet(
        key,
        new ethers.providers.JsonRpcProvider(
          "https://polygon-mainnet.g.alchemy.com/v2/p6cOz2Sah7mM9TmEJDq4PEmYFGC_YoSO"
        )
      );
      const nft = new ethers.Contract(nftAddress);
    };
    // Check localstorage
    let key = localStorage.getItem("privateKey");

    if (!key) {
      // Generate and save a key
      key = ethers.Wallet.createRandom().privateKey;
      localStorage.setItem("privateKey", key);
    }
    setPrivateKey(key);
    getNFT(key);
  }, []);

  return (
    <div className="App">
      <Pane
        display="flex"
        flexDirection="column"
        alignItems="center"
        width="100%"
        height="100vh"
      >
        {loading && <Spinner marginTop="1rem" color="#EF4127" />}
        {!loading && (
          <>
            <TextInput value={privateKey} disabled marginTop="1rem" />
            <Button marginTop="1rem">Purchase an NFT</Button>
            <Image src={nftURI} marginTop="1rem" />
          </>
        )}
      </Pane>
    </div>
  );
}

export default App;

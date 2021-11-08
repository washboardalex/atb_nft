import { Button, Image, Pane, Spinner, Text, Heading } from "evergreen-ui";
import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import abi from "./abi";
import axios from "axios";

const nftAddress = "0x957f821cc9074a65caf17023f5a46a15727039c8";
const getWallet = (key: string) => {
  return new ethers.Wallet(
    key,
    new ethers.providers.JsonRpcProvider(
      "https://polygon-mainnet.g.alchemy.com/v2/p6cOz2Sah7mM9TmEJDq4PEmYFGC_YoSO"
    )
  );
};
const getNFTContract = (provider: ethers.Signer) => {
  return new ethers.Contract(nftAddress, abi, provider);
};
function App() {
  const [privateKey, setPrivateKey] = useState("0xPRIVATE_KEY");
  const [loading, setLoading] = useState(true);
  const [nftURI, setNFTURI] = useState<string>("");
  const [buyingNFT, setBuying] = useState(false);

  useEffect(() => {
    const getNFT = async (key: string) => {
      const wallet = getWallet(key);
      const nft = getNFTContract(wallet);
      try {
        const ownedNFT = await nft.tokenOfOwnerByIndex(wallet.address, 0);
        const uri: string = await nft.tokenURI(ownedNFT);
        setNFTURI(uri);
      } catch (e) {
        console.log(e);
      }
      setLoading(false);
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
        <Image
          src="https://labrysprod.wpengine.com/wp-content/uploads/2019/03/logo_410x60.png"
          alt="Labrys logo"
        />
        <Heading size={800} marginTop="0.5rem">
          ATB NFT App
        </Heading>
        {loading && <Spinner marginTop="1rem" color="#EF4127" />}
        {!loading && (
          <>
            <Heading marginTop="1rem">Your private key</Heading>
            <Text
              marginTop="1rem"
              maxWidth="100%"
              wordBreak="break-word"
              fontWeight="bold"
            >
              {privateKey}
            </Text>

            <Button
              marginTop="1rem"
              disabled={!!nftURI}
              onClick={async () => {
                const wallet = getWallet(privateKey);
                const nft = getNFTContract(wallet);
                setBuying(true);
                try {
                  await axios.post("api/faucet", { address: wallet.address });
                  await nft.purchase();
                  const ownedNFT = await nft.tokenOfOwnerByIndex(
                    wallet.address,
                    0
                  );
                  const uri: string = await nft.tokenURI(ownedNFT);
                  setNFTURI(uri);
                } catch (e) {
                  console.log(e);
                  alert("Something went wrong");
                } finally {
                  setBuying(false);
                }
              }}
            >
              {buyingNFT ? (
                <>
                  Processing <Spinner marginLeft="0.5rem" size={12} />
                </>
              ) : (
                "Purchase an NFT"
              )}
            </Button>
            {nftURI && (
              <>
                <h3>Congratulations, you now own:</h3>
                <Image src={nftURI} marginTop="1rem" />
              </>
            )}
          </>
        )}
      </Pane>
    </div>
  );
}

export default App;

import { Button, Image, Pane, Spinner, TextInput } from "evergreen-ui";
import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import abi from "./abi";

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
        {loading && <Spinner marginTop="1rem" color="#EF4127" />}
        {!loading && (
          <>
            <TextInput value={privateKey} disabled marginTop="1rem" />
            <Button
              marginTop="1rem"
              disabled={!!nftURI}
              onClick={async () => {
                const wallet = getWallet(privateKey);
                const nft = getNFTContract(wallet);
                setBuying(true);
                try {
                  await nft.purchase();
                  const ownedNFT = await nft.tokenOfOwnerByIndex(
                    wallet.address,
                    0
                  );
                  const uri: string = await nft.tokenURI(ownedNFT);
                  setNFTURI(uri);
                } catch (e) {
                  console.log(e);
                  setNFTURI("https://placebear.com/300/300");
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
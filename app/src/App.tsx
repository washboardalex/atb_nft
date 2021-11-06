import { Button, Image, Pane, Spinner, TextInput } from "evergreen-ui";
import React, { useEffect, useState } from "react";
import { ethers } from "ethers";

function App() {
  const [privateKey, setPrivateKey] = useState("0xPRIVATE_KEY");
  const [loading, setLoading] = useState(true);
  const [nftURI, setNFTURI] = useState("https://placebear.com/300/300");

  useEffect(() => {
    // Check localstorage
    let key = localStorage.getItem("privateKey");
    if (!key) {
      // Generate and save a key
      key = ethers.Wallet.createRandom().privateKey;
      localStorage.setItem("privateKey", key);
    }
    setPrivateKey(key);
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

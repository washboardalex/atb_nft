import {
  Button,
  Image,
  Box,
  Spinner,
  Text,
  Heading,
  Container,
  Flex,
  IconButton,
  useDisclosure,
  useClipboard,
  useColorMode,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import abi from "../abi";
import axios from "axios";
import { UnlockIcon } from "@chakra-ui/icons";
import { css, Global } from "@emotion/react";

const nftAddress = "0xBC2d11A51Bdc923872B784741904cF44459c250E";
const getWallet = (key: string) => {
  return new ethers.Wallet(
    key,
    new ethers.providers.JsonRpcProvider(
      "https://polygon-mumbai.g.alchemy.com/v2/V4aCPpGIFvVzY9LvRIB-JRcofBKio3te"
    )
  );
};

const getNFTContract = (provider: ethers.Signer) =>
  new ethers.Contract(nftAddress, abi, provider);

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

  const { onToggle, isOpen } = useDisclosure();
  const { hasCopied, onCopy } = useClipboard(privateKey);

  const { colorMode } = useColorMode();

  return (
    <div className="App">
      <Global
        styles={css`
          body {
            background-color: ${colorMode === "light" ? "#f6f6f6" : "black"};
          }
        `}
      />
      <Image
        src="/Labrys_Logo_masterRGB-01.png"
        alt="Labrys logo"
        css={css`
          height: 8rem;
          display: none;
          @media (min-width: 500px) {
            display: initial;
          }
        `}
      />
      <Container
        css={css`
          padding-top: 20px;
          @media (max-width: 500px) {
            display: flex;
            flex-direction: column;
          }
        `}
      >
        <Flex justifyContent="center">
          <Image
            maxWidth="80%"
            src="/Labrys_Logo_masterRGB-01.png"
            alt="Labrys logo"
            paddingTop="3em"
            paddingBottom="2em"
            css={css`
              display: none;
              @media (max-width: 500px) {
                display: initial;
              }
            `}
          />
        </Flex>
        <Heading marginTop="0.5rem">ATB NFT Demo</Heading>
        <p>Explanation of whats happening here...</p>
        {loading && (
          <Flex width="100%" justifyContent="center" marginY="10">
            <Spinner size="xl" color="#00FFA7" />
          </Flex>
        )}
        {!loading && (
          <>
            <Button
              leftIcon={<UnlockIcon />}
              variant="outline"
              borderRadius="0"
              borderColor={colorMode === "light" ? "black" : "#f6f6f6"}
              marginY="4"
              onClick={onToggle}
            >
              {isOpen ? "Hide" : "Show"} private key
            </Button>

            {isOpen && (
              <Flex
                backgroundColor={colorMode === "light" ? "white" : "#838383"}
                padding="5"
                flexDir="column"
              >
                <Heading size="md">Your private key</Heading>
                <Text>
                  Copy your private key to import this address into a Polygon
                  wallet.
                </Text>
                <Flex alignItems="center" mt="1rem">
                  <Text
                    marginTop="1rem"
                    maxWidth="100%"
                    wordBreak="break-word"
                    isTruncated
                    fontWeight="bold"
                  >
                    {privateKey}
                  </Text>
                  <Button
                    size="sm"
                    marginLeft="10px"
                    variant="outline"
                    borderRadius="0"
                    borderColor={colorMode === "light" ? "black" : "#f6f6f6"}
                    minW="7em"
                    css={css`
                      display: none;
                      @media (min-width: 500px) {
                        display: initial;
                      }
                    `}
                    onClick={onCopy}
                  >
                    {hasCopied ? "Copied" : "Copy"}
                  </Button>
                </Flex>
                <Button
                  size="sm"
                  marginTop="10px"
                  variant="outline"
                  borderRadius="0"
                  borderColor={colorMode === "light" ? "black" : "#f6f6f6"}
                  css={css`
                    display: none;
                    @media (max-width: 500px) {
                      display: initial;
                    }
                  `}
                  onClick={onCopy}
                >
                  {hasCopied ? "Copied" : "Copy"}
                </Button>
              </Flex>
            )}
            <br />
            {!nftURI && (
              <Button
                variant="outline"
                borderRadius="0"
                borderColor={colorMode === "light" ? "black" : "#f6f6f6"}
                marginTop="1rem"
                onClick={async () => {
                  const wallet = getWallet(privateKey);
                  const nft = getNFTContract(wallet);
                  setBuying(true);
                  try {
                    await axios.post("api/faucet", { address: wallet.address });
                  } catch (e) {
                    console.log(e);
                  }
                  try {
                    const tx = await nft.purchase();
                    await tx.wait();
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
                    Processing <Spinner marginLeft="0.5rem" />
                  </>
                ) : (
                  "Claim NFT"
                )}
              </Button>
            )}

            {nftURI && (
              <Box marginTop="2rem">
                <Heading size="md">Congratulations, you now own</Heading>
                <Image
                  src={nftURI}
                  marginTop="1rem"
                  alt="NFT"
                  marginBottom="30px"
                />
              </Box>
            )}
          </>
        )}
      </Container>
    </div>
  );
}

export default App;

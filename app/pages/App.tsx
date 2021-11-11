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
  Link,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import abi from "../abi";
import axios from "axios";
import { ExternalLinkIcon, UnlockIcon } from "@chakra-ui/icons";
import { css, Global } from "@emotion/react";
import QRCode from "qrcode.react";

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

  const [address, setAddress] = useState("");
  const [txHash, setTxHash] = useState("");

  useEffect(() => {
    const getNFT = async (key: string) => {
      const wallet = getWallet(key);
      setAddress(wallet.address);

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
            padding-bottom: 30px;
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
          <Box
            css={css`
              display: none;
              @media (min-width: 500px) {
                display: flex;
                margin-bottom: 20px;
              }
            `}
            flexDir="column"
            justifyContent="center"
            alignItems="center"
          >
            <Heading size="xl" mb="3">
              atb-nft.labrys.group
            </Heading>
            <QRCode
              value="https://atb-nft.labrys.group/"
              size={300}
              bgColor={colorMode === "light" ? "#f6f6f6" : "black"}
              fgColor={colorMode === "light" ? "black" : "#f6f6f6"}
            />
          </Box>
        </Flex>
        <Heading marginTop="0.5rem" size="2xl">
          Actual Title
        </Heading>
        <Heading marginY="0.5rem" size="xl">
          ATB NFT Demo
        </Heading>
        <Text marginY="3">
          The website has generated a Polygon wallet for you, click below to
          show and save your private key. You can see your address{" "}
          <Link
            href={`https://polygonscan.com/address/${address}`}
            isExternal
            color="#00FFA7"
          >
            here on Polygonscan <ExternalLinkIcon mx="2px" />
          </Link>
        </Text>
        <Text marginY="3">
          Claiming the NFT will send a transaction to the NFT contract, which
          will send an NFT to your wallet.
        </Text>
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
                css={css`
                  align-items: flex-start;
                  @media (max-width: 500px) {
                    align-items: initial;
                  }
                `}
              >
                <Heading size="md">Your private key</Heading>
                <Text>
                  Copy your private key to import this address into a Polygon
                  wallet.
                </Text>
                <Flex alignItems="center" mt="1rem">
                  <Text
                    marginTop="1rem"
                    maxWidth="90%"
                    wordBreak="break-word"
                    fontWeight="bold"
                  >
                    {privateKey}
                  </Text>
                </Flex>
                <Button
                  size="sm"
                  marginTop="10px"
                  variant="outline"
                  borderRadius="0"
                  borderColor={colorMode === "light" ? "black" : "#f6f6f6"}
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

                    setTxHash(tx.hash);

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
                  alt="NFT Image"
                  marginBottom="30px"
                />
                <Text>Transaction Hash: {txHash} </Text>
                <Link isExternal color="#00FFA7">
                  View on Polygonscan <ExternalLinkIcon mx="2px" />
                </Link>
              </Box>
            )}
          </>
        )}
      </Container>
    </div>
  );
}

export default App;

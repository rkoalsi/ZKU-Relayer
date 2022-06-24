import type { NextPage } from 'next';
import Head from 'next/head';
import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { VStack, Heading, Box } from '@chakra-ui/layout';
import {
  Text,
  Button,
  Input,
  InputGroup,
  InputRightElement,
  useToast,
} from '@chakra-ui/react';
import { TITLE, CONTRACT_ADDRESS } from '../constants';
import Payer from '../chain/artifacts/contracts/Payer.sol/Payer.json';

declare let window: any;

const Home: NextPage = () => {
  const toast = useToast();
  const [balance, setBalance] = useState<string | undefined>();
  const [currentAccount, setCurrentAccount] = useState<string | undefined>();
  const [chainId, setChainId] = useState<number | undefined>();
  const [networkName, setNetworkName] = useState<string | undefined>();
  const [amount, setAmount] = useState<number | undefined>();
  const [receiver, setReceiver] = useState<string | undefined>();

  useEffect(() => {
    if (!currentAccount || !ethers.utils.isAddress(currentAccount)) return;
    //client side code
    if (!window.ethereum) return;

    const provider = new ethers.providers.Web3Provider(window.ethereum);

    provider.getBalance(currentAccount).then((result) => {
      setBalance(ethers.utils.formatEther(result));
    });

    provider.getNetwork().then((result) => {
      setChainId(result.chainId);
    });
  }, [currentAccount]);

  const onClickConnect = async () => {
    //client side code
    if (!window.ethereum) {
      console.log('please install MetaMask');
      return;
    }
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    try {
      const acc = await provider.send('eth_requestAccounts', []);
      if (acc.length > 0) {
        setCurrentAccount(acc[0]);
        const r = await provider.getNetwork();
        setNetworkName(r.name);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const onClickDisconnect = () => {
    console.log('onClickDisconnect');
    setBalance(undefined);
    setCurrentAccount(undefined);
  };
  const handleMax = () => {
    if (balance) {
      setAmount(parseFloat(balance));
    }
  };
  const onClickRelay = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    if (receiver && ethers.utils.isAddress(receiver) && amount && amount > 0) {
      const signer = provider.getSigner();
      const payerContract = new ethers.Contract(
        CONTRACT_ADDRESS,
        Payer.abi,
        signer
      );
      // const tx = await signer.sendTransaction({
      //   to: receiver,
      //   value: ethers.utils.parseEther(amount.toString()),
      // });
      const tx = await payerContract.transfer(
        receiver,
        ethers.utils.parseEther(amount.toString())
      );
      console.log(tx);
      toast({
        title: 'Relaying Transaction',
        description: `We are sending ${amount} to ${receiver}, Transaction Hash: ${tx.hash}`,
        status: 'success',
        duration: 9000,
        isClosable: true,
      });
    } else {
      toast({
        title: 'Transaction Not Attempted',
        description: `Please enter a valid Ethereum Address`,
        status: 'error',
        duration: 9000,
        isClosable: true,
      });
    }
  };
  return (
    <>
      <Head>
        <title>{TITLE}</title>
      </Head>
      <Heading as='h3' my={4} justifyContent={'center'}>
        {TITLE}
      </Heading>
      <VStack>
        <Box w='100%' my={4}>
          {currentAccount ? (
            <Button w='100%' onClick={onClickDisconnect}>
              Account:{currentAccount}
            </Button>
          ) : (
            <Button w='100%' onClick={onClickConnect}>
              Connect MetaMask
            </Button>
          )}
        </Box>
        {currentAccount ? (
          <VStack>
            <Box mb={0} p={4} w='100%' borderWidth='1px' borderRadius='lg'>
              <Heading my={4} fontSize='xl'>
                Account info
              </Heading>
              <Text>
                Balance of current account: {balance} ETH on {networkName}
              </Text>
              <Text>Chain Info: ChainId {chainId}</Text>
            </Box>
            <Box
              mb={0}
              p={4}
              w='100%'
              borderWidth='1px'
              borderRadius='lg'
              justifyContent={'center'}
              alignItems={'center'}
            >
              <Box pb={4}>
                <Text mb='8px'>To: </Text>
                <Input
                  type={'text'}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setReceiver(e.target.value);
                  }}
                />
              </Box>
              <Box pb={4}>
                <Text mb='8px'>Amount: </Text>
                <InputGroup size='md'>
                  <Input
                    type={'number'}
                    value={amount}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      setAmount(parseFloat(e.target.value));
                    }}
                  />
                  <InputRightElement width='4.5rem'>
                    <Button h='1.75rem' size='sm' onClick={handleMax}>
                      Max
                    </Button>
                  </InputRightElement>
                </InputGroup>
              </Box>
              <Button onClick={onClickRelay}>Relay Transaction</Button>
            </Box>
          </VStack>
        ) : (
          <></>
        )}
      </VStack>
    </>
  );
};

export default Home;

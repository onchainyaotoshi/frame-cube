import { ethers } from 'ethers';
import { Core } from '@quicknode/sdk';
import { baseSepolia, base } from 'viem/chains'; // Change the network as needed
import { createWalletClient, http } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import {loadJsonFile} from 'load-json-file';

import {isLive} from '@utils/dev-tools.js';

import path from 'path';
import { createPathContext } from '@utils/path-resolver.js';
const { resolvePath } = createPathContext(import.meta.url);

const TEST = await loadJsonFile(resolvePath(path.join('abi','test.json')));
const TOSHI = await loadJsonFile(resolvePath(path.join('abi','toshi.json')));
const FRAME = await loadJsonFile(resolvePath(path.join('abi','frame.json')));

const SMART_CONTRACT = {
    "test": { ticker: 'test', abi: TEST, address: '0x443277459cE1D7AE44B6247B4AC4b16C1A3eeB54', amount:100 },
    "toshi": { ticker: 'toshi', abi: TOSHI, address: '0xAC1Bd2486aAf3B5C0fc3Fd868558b082a531B2B4', amount: 100},
    "frame": { ticker: 'frame',abi: FRAME, address: '0x91F45aa2BdE7393e0AF1CC674FFE75d746b93567', amount: 10000 }
};


if(isLive()){
    delete SMART_CONTRACT.test;
}else{
    delete SMART_CONTRACT.toshi;
    delete SMART_CONTRACT.frame;
}

// Define your private key
const privateKey = '0x' + process.env.FC_WALLET_PRIVATE_KEY;

// Convert the private key to an account object
const account = privateKeyToAccount(privateKey);

// Initialize the clients
const core = new Core({
    endpointUrl: process.env.FC_QUICKNODE_HTTPS_URL,
});

const walletClient = createWalletClient({ account, chain: isLive() ? base : baseSepolia, transport: http(core.endpointUrl) });

export const getTokenReward = ()=>{
    const keys = Object.keys(SMART_CONTRACT);
    const randomKey = keys[Math.floor(Math.random() * keys.length)];

    return SMART_CONTRACT[randomKey];
}

export const sendEth = async (to, amount) => {
    const provider = new ethers.JsonRpcProvider(process.env.FC_QUICKNODE_HTTPS_URL);
    const signer = new ethers.Wallet(process.env.FC_WALLET_PRIVATE_KEY, provider);

    const tx = await signer.sendTransaction({
        to: to,
        value: ethers.parseUnits(amount+"", 'ether'),
    });

    return tx.hash;
}

export const sendErc20 = async (token, to, amount) => {
    const { request } = await core.client.simulateContract({
        address: SMART_CONTRACT[token].address,
        abi: SMART_CONTRACT[token].abi,
        functionName: 'transfer',
        args: [to, ethers.parseUnits(amount+"", 'ether')],
        account
    });

    return await walletClient.writeContract(request);
}
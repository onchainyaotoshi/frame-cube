import { ethers } from 'ethers';
import { Core } from '@quicknode/sdk';
import { baseSepolia } from 'viem/chains'; // Change the network as needed
import { createWalletClient, http } from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import frame from '@utils/wallet/abi/frame.json' assert { type: 'json' };
import toshi from '@utils/wallet/abi/toshi.json' assert { type: 'json' };
import test from '@utils/wallet/abi/test.json' assert { type: 'json' };

const SMART_CONTRACT = {
    "test": { abi: test, address: '0x443277459cE1D7AE44B6247B4AC4b16C1A3eeB54' },
    "toshi": { abi: toshi, address: '0xAC1Bd2486aAf3B5C0fc3Fd868558b082a531B2B4' },
    "frame": { abi: frame, address: '0x91F45aa2BdE7393e0AF1CC674FFE75d746b93567' }
};

// Define your private key
const privateKey = '0x' + process.env.FC_WALLET_PRIVATE_KEY;

// Convert the private key to an account object
const account = privateKeyToAccount(privateKey);

// Initialize the clients
const core = new Core({
    endpointUrl: process.env.FC_QUICKNODE_HTTPS_URL,
});

const walletClient = createWalletClient({ account, chain: baseSepolia, transport: http(core.endpointUrl) });

export const sendEth = async (to, amount) => {
    if (typeof amount != 'string') {
        throw new Error('amount must be a string');
    }

    const provider = new ethers.JsonRpcProvider(process.env.FC_QUICKNODE_HTTPS_URL);
    const signer = new ethers.Wallet(process.env.FC_WALLET_PRIVATE_KEY, provider);

    const tx = await signer.sendTransaction({
        to: to,
        value: ethers.parseUnits(amount, 'ether'),
    });

    return tx.hash;
}

export const sendErc20 = async (token, to, amount) => {
    if (typeof amount != 'string') {
        throw new Error('amount must be a string');
    }
    const { request } = await core.client.simulateContract({
        address: SMART_CONTRACT[token].address,
        abi: SMART_CONTRACT[token].abi,
        functionName: 'transfer',
        args: [to, ethers.parseUnits(amount, 'ether')],
        account
    });

    return await walletClient.writeContract(request);
}
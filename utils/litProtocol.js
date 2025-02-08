import * as LitJsSdk from '@lit-protocol/lit-node-client';
import { encryptString, decryptToString } from '@lit-protocol/encryption';


class LitProtocolManager {
    constructor() {
        this.client = new LitJsSdk.LitNodeClient({
          litNetwork: "datil-test" // Use "datil" for mainnet, "datil-test" for testnet
        });
        this.chain = 'ethereum';
    }

    async connect() {
        await this.client.connect();
        console.log("Connected to Lit Protocol");
    }

    async encryptString(str) {
        if (!this.client.ready) await this.connect();
        
        const authSig = await LitJsSdk.checkAndSignAuthMessage({chain: this.chain});
        
        const accessControlConditions = [
            {
                contractAddress: '',
                standardContractType: '',
                chain: this.chain,
                method: 'eth_getBalance',
                parameters: [':userAddress', 'latest'],
                returnValueTest: {
                    comparator: '>=',
                    value: '0'  // This allows any address with a balance
                }
            }
        ];
    
        const { ciphertext, dataToEncryptHash } = await encryptString({
            accessControlConditions,
            dataToEncrypt: str,
            chain: this.chain,
            authSig,
        }, this.client);
    
        return {
            encryptedString: ciphertext,
            dataToEncryptHash
        };
    }
    

    async decryptToString(encryptedStr, dataToEncryptHash) {
        if (!this.client.ready) await this.connect();
    
        const authSig = await LitJsSdk.checkAndSignAuthMessage({chain: this.chain});
        
        const accessControlConditions = [
            {
                contractAddress: '',
                standardContractType: '',
                chain: this.chain,
                method: 'eth_getBalance',
                parameters: [':userAddress', 'latest'],
                returnValueTest: {
                    comparator: '>=',
                    value: '0'
                }
            }
        ];
    
        const decryptedString = await decryptToString(
            {
                accessControlConditions,
                ciphertext: encryptedStr,
                dataToEncryptHash,
                chain: this.chain,
                authSig,
            },
            this.client
        );
    
        return decryptedString;
    }
    
    
}

export const litProtocolManager = new LitProtocolManager();

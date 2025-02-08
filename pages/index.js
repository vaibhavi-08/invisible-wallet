import React, { useEffect, useState } from 'react';
import { litProtocolManager } from '../utils/litProtocol';

export default function Home() {
  const [encryptedData, setEncryptedData] = useState(null);
  const [decryptedData, setDecryptedData] = useState(null);

  useEffect(() => {
    async function testLitProtocol() {
      try {
        const testString = "Hello, Lit Protocol!";
        const encrypted = await litProtocolManager.encryptString(testString);
        setEncryptedData(encrypted);

        const decrypted = await litProtocolManager.decryptString(
          encrypted.encryptedString,
          encrypted.encryptedSymmetricKey
        );
        setDecryptedData(decrypted);
      } catch (error) {
        console.error("Error testing Lit Protocol:", error);
      }
    }

    testLitProtocol();
  }, []);

  return (
    <div>
      <h1>Lit Wallet Friend Manager</h1>
      <div>
        <h2>Encrypted Data:</h2>
        <pre>{JSON.stringify(encryptedData, null, 2)}</pre>
      </div>
      <div>
        <h2>Decrypted Data:</h2>
        <p>{decryptedData}</p>
      </div>
    </div>
  );
}
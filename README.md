# MedChain: Decentralized Medical Record Management

 MedChain is a secure, decentralized application (dApp) for managing medical records. It leverages **Ethereum** (or compatible EVM chains) for access control and **IPFS** for decentralized storage. All medical records are **AES-256 encrypted** client-side before upload, ensuring data privacy and patient sovereignty.

## 🌟 Features

- **Decentralized Identity**: Login with MetaMask.
- **Role-Based Access**: Specialized dashboards for Patients and Doctors.
- **Privacy First**: Client-side AES-256-GCM encryption.
- **Secure Sharing**: Patients grant/revoke access to specific doctors.
- **Audit Logging**: Immutable history of file access and sharing on the blockchain.
- **Censorship Resistant**: Data stored on IPFS, not central servers.

---

## 🛠️ Tech Stack

- **Frontend**: React (Vite), Tailwind CSS
- **Blockchain**: Solidity, Ethers.js v6
- **Storage**: IPFS (via Infura/Pinata/Local node)
- **Encryption**: Web Crypto API (Native browser standard)

---

## 🚀 Getting Started

### Prerequisites

1. **Node.js** (v18+)
2. **MetaMask** browser extension
3. **Git**

### 1. Installation

```bash
git clone https://github.com/yourusername/medchain.git
cd medchain
npm install
```

### 2. Configuration

Create a `.env` file in the root directory:

```env
# Contract Address (Update after deployment)
VITE_CONTRACT_ADDRESS=

# IPFS Configuration (Example using Infura)
# If using a public gateway, some settings might differ.
VITE_IPFS_API_URL=https://ipfs.infura.io:5001
VITE_IPFS_PROJECT_ID=your_infura_project_id
VITE_IPFS_PROJECT_SECRET=your_infura_project_secret
```

> **Note**: For testing without an IPFS provider account, you can try running a local IPFS node and setting `VITE_IPFS_API_URL=http://localhost:5001`.

### 3. Smart Contract Deployment

You can deploy the contract using Remix IDE or Hardhat.

**Using Remix (Easiest for testing):**
1. Go to [Remix IDE](https://remix.ethereum.org).
2. Create a new file `MedChain.sol` and paste the content from `contracts/MedChain.sol`.
3. Compile the contract (Ctrl+S).
4. Go to the "Deploy" tab, select "Injected Provider - MetaMask".
5. Deploy to **Sepolia Testnet** (ensure you have test ETH).
6. Copy the **Contract Address** and paste it into your `.env` file as `VITE_CONTRACT_ADDRESS`.

### 4. Run the dApp

```bash
npm run dev
```

Open `http://localhost:5173` in your browser.

---

## 🧪 How to Use

### 1. Patient Flow
1. Connect Wallet.
2. Register as a **Patient**.
3. Go to "Upload Record", select a file (PDF/Image).
4. file is encrypted -> Uploaded to IPFS -> CID stored on chain.
5. Go to "Access Control", enter a Doctor's wallet address to grant access.

### 2. Doctor Flow
1. Switch MetaMask account.
2. Connect and Register as a **Doctor**.
3. Go to "Patient Search", enter the Patient's wallet address.
4. If authorized, you will see their records.
5. Click "View" to decrypt and display the file.

---

## ⚠️ Known Limitations (Demo Quality)

1. **Key Storage**: Encryption keys are stored in `localStorage` for the demo. **This is not secure for production.** In a real app, keys should be encrypted with the user's public key or handled via a KMS.
2. **IPFS Pinning**: This demo uses public/dev IPFS gateways. Files may be garbage collected if not pinned. Use a paid pinning service for production.
3. **Gas Costs**: Every upload and access grant requires a transaction fee.

---

## 📜 License

MIT

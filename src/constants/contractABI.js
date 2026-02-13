export const CONTRACT_ABI = [
    {
        "anonymous": false,
        "inputs": [
            { "indexed": true, "internalType": "address", "name": "patient", "type": "address" },
            { "indexed": true, "internalType": "address", "name": "doctor", "type": "address" },
            { "indexed": false, "internalType": "uint256", "name": "timestamp", "type": "uint256" }
        ],
        "name": "AccessGranted",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            { "indexed": true, "internalType": "address", "name": "patient", "type": "address" },
            { "indexed": true, "internalType": "address", "name": "doctor", "type": "address" },
            { "indexed": false, "internalType": "uint256", "name": "timestamp", "type": "uint256" }
        ],
        "name": "AccessRevoked",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            { "indexed": true, "internalType": "address", "name": "patient", "type": "address" },
            { "indexed": false, "internalType": "string", "name": "cid", "type": "string" },
            { "indexed": false, "internalType": "string", "name": "fileName", "type": "string" },
            { "indexed": false, "internalType": "uint256", "name": "timestamp", "type": "uint256" }
        ],
        "name": "RecordStored",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            { "indexed": true, "internalType": "address", "name": "user", "type": "address" },
            { "indexed": false, "internalType": "string", "name": "role", "type": "string" },
            { "indexed": false, "internalType": "uint256", "name": "timestamp", "type": "uint256" }
        ],
        "name": "RoleRegistered",
        "type": "event"
    },
    {
        "inputs": [
            { "internalType": "address", "name": "patient", "type": "address" }
        ],
        "name": "getPatientRecords",
        "outputs": [
            {
                "components": [
                    { "internalType": "string", "name": "cid", "type": "string" },
                    { "internalType": "uint256", "name": "timestamp", "type": "uint256" },
                    { "internalType": "string", "name": "fileName", "type": "string" },
                    { "internalType": "string", "name": "fileType", "type": "string" }
                ],
                "internalType": "struct MedChain.RecordMetadata[]",
                "name": "",
                "type": "tuple[]"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getRecords",
        "outputs": [
            {
                "components": [
                    { "internalType": "string", "name": "cid", "type": "string" },
                    { "internalType": "uint256", "name": "timestamp", "type": "uint256" },
                    { "internalType": "string", "name": "fileName", "type": "string" },
                    { "internalType": "string", "name": "fileType", "type": "string" }
                ],
                "internalType": "struct MedChain.RecordMetadata[]",
                "name": "",
                "type": "tuple[]"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            { "internalType": "address", "name": "user", "type": "address" }
        ],
        "name": "getRole",
        "outputs": [
            { "internalType": "string", "name": "", "type": "string" }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            { "internalType": "address", "name": "doctor", "type": "address" }
        ],
        "name": "grantAccess",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            { "internalType": "address", "name": "patient", "type": "address" },
            { "internalType": "address", "name": "doctor", "type": "address" }
        ],
        "name": "isAuthorized",
        "outputs": [
            { "internalType": "bool", "name": "", "type": "bool" }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            { "internalType": "string", "name": "role", "type": "string" }
        ],
        "name": "registerRole",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            { "internalType": "address", "name": "doctor", "type": "address" }
        ],
        "name": "revokeAccess",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            { "internalType": "string", "name": "cid", "type": "string" },
            { "internalType": "string", "name": "fileName", "type": "string" },
            { "internalType": "string", "name": "fileType", "type": "string" }
        ],
        "name": "storeCID",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            { "internalType": "address", "name": "", "type": "address" }
        ],
        "name": "userRoles",
        "outputs": [
            { "internalType": "string", "name": "", "type": "string" }
        ],
        "stateMutability": "view",
        "type": "function"
    }
];

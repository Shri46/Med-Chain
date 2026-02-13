// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title MedChain
 * @dev Decentralized Medical Record Management System
 * Stores IPFS CIDs of encrypted medical records with role-based access control.
 */
contract MedChain {
    // string constants for roles
    string private constant ROLE_PATIENT = "patient";
    string private constant ROLE_DOCTOR = "doctor";

    // Struct to hold record metadata
    struct RecordMetadata {
        string cid;
        uint256 timestamp;
        string fileName;
        string fileType;
    }

    // State Variables
    // user address => role ("patient" or "doctor")
    mapping(address => string) public userRoles;
    
    // patient address => array of their records
    mapping(address => RecordMetadata[]) private patientRecords;
    
    // patient address => doctor address => isAuthorized
    mapping(address => mapping(address => bool)) private accessControl;

    // Events for Audit Log
    event RecordStored(address indexed patient, string cid, string fileName, uint256 timestamp);
    event AccessGranted(address indexed patient, address indexed doctor, uint256 timestamp);
    event AccessRevoked(address indexed patient, address indexed doctor, uint256 timestamp);
    event RoleRegistered(address indexed user, string role, uint256 timestamp);

    // Modifiers
    modifier onlyPatient() {
        require(keccak256(bytes(userRoles[msg.sender])) == keccak256(bytes(ROLE_PATIENT)), "MedChain: Caller is not a patient");
        _;
    }

    modifier onlyDoctor() {
        require(keccak256(bytes(userRoles[msg.sender])) == keccak256(bytes(ROLE_DOCTOR)), "MedChain: Caller is not a doctor");
        _;
    }

    modifier hasAccess(address patient) {
        require(accessControl[patient][msg.sender], "MedChain: Doctor is not authorized");
        _;
    }

    /**
     * @dev Register the caller as a patient or doctor.
     * @param role The role to register ("patient" or "doctor").
     */
    function registerRole(string memory role) public {
        require(bytes(userRoles[msg.sender]).length == 0, "MedChain: User already registered");
        require(
            keccak256(bytes(role)) == keccak256(bytes(ROLE_PATIENT)) || 
            keccak256(bytes(role)) == keccak256(bytes(ROLE_DOCTOR)),
            "MedChain: Invalid role"
        );

        userRoles[msg.sender] = role;
        emit RoleRegistered(msg.sender, role, block.timestamp);
    }

    /**
     * @dev Store a new record CID for the calling patient.
     * @param cid The IPFS CID of the encrypted file.
     * @param fileName The original name of the file.
     * @param fileType The MIME type of the file.
     */
    function storeCID(string memory cid, string memory fileName, string memory fileType) public onlyPatient {
        require(bytes(cid).length > 0, "MedChain: CID cannot be empty");

        RecordMetadata memory newRecord = RecordMetadata({
            cid: cid,
            timestamp: block.timestamp,
            fileName: fileName,
            fileType: fileType
        });

        patientRecords[msg.sender].push(newRecord);
        emit RecordStored(msg.sender, cid, fileName, block.timestamp);
    }

    /**
     * @dev Grant a doctor access to the calling patient's records.
     * @param doctor The address of the doctor to grant access to.
     */
    function grantAccess(address doctor) public onlyPatient {
        require(doctor != address(0), "MedChain: Invalid doctor address");
        require(doctor != msg.sender, "MedChain: Cannot grant access to self");
        // Optional: Check if the address is actually registered as a doctor
        // require(keccak256(bytes(userRoles[doctor])) == keccak256(bytes(ROLE_DOCTOR)), "MedChain: Address is not a registered doctor");

        accessControl[msg.sender][doctor] = true;
        emit AccessGranted(msg.sender, doctor, block.timestamp);
    }

    /**
     * @dev Revoke a doctor's access to the calling patient's records.
     * @param doctor The address of the doctor to revoke access from.
     */
    function revokeAccess(address doctor) public onlyPatient {
        require(doctor != address(0), "MedChain: Invalid doctor address");
        
        accessControl[msg.sender][doctor] = false;
        emit AccessRevoked(msg.sender, doctor, block.timestamp);
    }

    /**
     * @dev Get the caller's own records.
     * @return An array of RecordMetadata structs.
     */
    function getRecords() public view onlyPatient returns (RecordMetadata[] memory) {
        return patientRecords[msg.sender];
    }

    /**
     * @dev Get a patient's records as an authorized doctor.
     * @param patient The address of the patient whose records are being requested.
     * @return An array of RecordMetadata structs.
     */
    function getPatientRecords(address patient) public view onlyDoctor hasAccess(patient) returns (RecordMetadata[] memory) {
        return patientRecords[patient];
    }

    /**
     * @dev Check if a doctor is authorized to view a patient's records.
     * @param patient The address of the patient.
     * @param doctor The address of the doctor.
     * @return True if authorized, false otherwise.
     */
    function isAuthorized(address patient, address doctor) public view returns (bool) {
        return accessControl[patient][doctor];
    }

    /**
     * @dev Get the role of a specific user.
     * @param user The address of the user.
     * @return The role string ("patient", "doctor", or "").
     */
    function getRole(address user) public view returns (string memory) {
        return userRoles[user];
    }
}

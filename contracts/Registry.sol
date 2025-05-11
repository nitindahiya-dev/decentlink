// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Registry {
    // Mapping from 6-byte short code to IPFS CID (bytes)
    mapping(bytes6 => bytes) private entries;

    // Event emitted when a new entry is registered
    event Registered(bytes6 indexed shortCode, bytes cid, address indexed author);

    /// @notice Register a short code with its IPFS CID
    /// @param shortCode 6-byte identifier (e.g., "abc123")
    /// @param cid IPFS CID as bytes
    function register(bytes6 shortCode, bytes calldata cid) external {
        require(entries[shortCode].length == 0, "Short code already registered");
        entries[shortCode] = cid;
        emit Registered(shortCode, cid, msg.sender);
    }

    /// @notice Resolve a short code to its IPFS CID
    /// @param shortCode 6-byte identifier
    /// @return The stored CID bytes
    function resolve(bytes6 shortCode) external view returns (bytes memory) {
        bytes memory cid = entries[shortCode];
        require(cid.length != 0, "Entry not found");
        return cid;
    }
}

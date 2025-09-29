pragma solidity ^0.8.0;

import "./MerkleTreeWithHistory.sol";

interface IVerifier {
    function verifyProof(
        uint256[2] calldata _pA,
        uint256[2][2] calldata _pB,
        uint256[2] calldata _pC,
        uint256[6] calldata _pubSignals
    ) external view returns (bool);
}

contract HurricaneCash is MerkleTreeWithHistory {
    IVerifier public immutable verifier;
    uint256 public immutable denomination;
    mapping(bytes32 => bool) public nullifierHashes;
    mapping(bytes32 => bool) public commitments;

    constructor(IVerifier _verifier, IHasher _hasher, uint32 _merkleTreeHeight, uint256 _denomination)
        MerkleTreeWithHistory(_merkleTreeHeight, _hasher)
    {
        verifier = _verifier;
        denomination = _denomination;
    }

    function deposit(bytes32 _commitment) external payable {
        require(msg.value == denomination, "Please send `denomination` ETH along with transaction");
        _insert(_commitment);
        commitments[_commitment] = true;  
    }

    function withdraw(
        uint256[2] calldata _pA,
        uint256[2][2] calldata _pB,
        uint256[2] calldata _pC,
        bytes32 _root,
        bytes32 _nullifierHash,
        address _recipient,
        address _relayer,
        uint256 _fee,
        uint256 _refund
    ) external payable {
        require(!nullifierHashes[_nullifierHash], "The note has been already spent");
        require(
            verifier.verifyProof(
                _pA,
                _pB,
                _pC,
                [
                    uint256(_root),
                    uint256(_nullifierHash),
                    uint256(uint160(_recipient)),
                    uint256(uint160(_relayer)),
                    _fee,
                    _refund
                ]
            ),
            "Invalid withdraw proof"
        );

        nullifierHashes[_nullifierHash] = true;
        payable(_recipient).transfer(_refund - _fee);
        payable(_relayer).transfer(_fee);
    }
}

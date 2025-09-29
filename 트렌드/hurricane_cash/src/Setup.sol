pragma solidity ^0.8.0;

import "src/HurricaneCash.sol";
import "src/Verifier.sol";
import "src/MimcSponge.sol";

contract Setup {
    HurricaneCash public hurricaneCash;
    IVerifier public verifier;
    IHasher public hasher;


    constructor() payable {
        assert(msg.value == 200_000 ether);
        verifier = IVerifier(address(new Groth16Verifier()));
        hasher = IHasher(deployMimcSponge(MimcSponge.code));
        hurricaneCash = new HurricaneCash(verifier, hasher, 10, 200 ether);

        for(uint i=0;i<1000;i++){
            hurricaneCash.deposit{value: 200 ether}(hex"1111111111111111111111111111111111111111111111111111111111111111");
        }
    }

    function deployMimcSponge(bytes memory bytecode) public returns (address) {
        address deployedAddress;
        assembly {
            deployedAddress := create(0, add(bytecode, 0x20), mload(bytecode))
            if iszero(deployedAddress) { revert(0, 0) }
        }
        return deployedAddress;
    }

    function isSolved() public view returns (bool) {
        return address(hurricaneCash).balance == 0;
    }
}
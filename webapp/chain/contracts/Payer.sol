// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
contract Payer {
    address payable public Owner;
    fallback () external payable {}
receive () external payable {
    // Do whatever you want when receiving funds...
  }
      constructor ()  { 
        Owner = payable(msg.sender); 
    }
    
   modifier onlyOwner() {
        require(msg.sender == Owner, 'Not owner'); 
        _;
    } 
    function withdraw(uint _amount) public onlyOwner { 
        Owner.transfer(_amount); 
    }
     function transfer(address to, uint256 amount) public {
        require(msg.sender==Owner);
        payable(to).transfer(amount);
    }

    function getBalance() external view returns (uint256) {
        return address(this).balance;
    }
}

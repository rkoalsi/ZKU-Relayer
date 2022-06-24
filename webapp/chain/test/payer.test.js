const { expect } = require("chai");
const { ethers, waffle } = require("hardhat");

describe("Transactions", function () {
  it("Should transfer tokens between accounts", async function () {
    const [owner, addr1] = await ethers.getSigners();
    const Payer = await ethers.getContractFactory("Payer");
    const provider = waffle.provider;
    const hardhatToken = await Payer.deploy({ gasPrice: 50000000000 });
    //initial contract balance should be 0
    expect(await hardhatToken.getBalance()).to.equal(0);
    await owner.sendTransaction({
      from: owner.address,
      to: hardhatToken.address,
      value: ethers.utils.parseEther("2"),
    });
    //contract balance should be 1 ETH
    expect(await hardhatToken.getBalance()).to.equal(
      ethers.utils.parseEther("2")
    );
    // Transfer 1 ETH from contract to addr1
    await hardhatToken.transfer(addr1.address, ethers.utils.parseEther("1"));
    // Withdrawing Remaining ETH from contract to owner account
    await hardhatToken.withdraw(ethers.utils.parseEther("1"));

    expect(await hardhatToken.getBalance()).to.equal(0);
    const bal = Math.trunc(
      ethers.utils.formatEther(await provider.getBalance(owner.address))
    );
    expect(bal).to.equal(9998);
  });
});

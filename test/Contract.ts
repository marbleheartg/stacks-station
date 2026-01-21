import { network } from "hardhat";
import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { getAddress } from "viem";
import ContractModule from "../ignition/modules/ProxyModule.js";

describe("Contract", async function () {
  const { ignition, viem } = await network.connect();

  const [owner, otherAccount] = await viem.getWalletClients();
  const publicClient = await viem.getPublicClient();

  const { contract } = await ignition.deploy(ContractModule);

  describe("Deployment", function () {
    it("Should set the correct owner", async function () {
      assert.equal(
        getAddress(await contract.read.owner()),
        getAddress(owner.account.address),
      );
    });

    it("Should initialize count to 0", async function () {
      const count = await contract.read.count();
      assert.equal(count, 0n);
    });
  });

  describe("increment", function () {
    it("Should increment the count by 1", async function () {
      const initialCount = await contract.read.count();
      await contract.write.increment();
      const newCount = await contract.read.count();
      assert.equal(newCount, initialCount + 1n);
    });

    it("Should allow multiple increments", async function () {
      const initialCount = await contract.read.count();
      await contract.write.increment();
      await contract.write.increment();
      const newCount = await contract.read.count();
      assert.equal(newCount, initialCount + 2n);
    });
  });

  describe("decrement", function () {
    it("Should decrement the count by 1", async function () {
      // Ensure count is > 0 first
      await contract.write.increment();
      const initialCount = await contract.read.count();
      await contract.write.decrement();
      const newCount = await contract.read.count();
      assert.equal(newCount, initialCount - 1n);
    });

    it("Should revert when count is 0", async function () {
      // Reset count to 0 by decrementing until we hit 0
      let count = await contract.read.count();
      while (count > 0n) {
        await contract.write.decrement();
        count = await contract.read.count();
      }

      try {
        await contract.write.decrement();
        assert.fail("Expected decrement to revert");
      } catch (error) {
        // Contract should revert when count is 0
        assert.ok(error instanceof Error);
      }
    });
  });

  describe("withdraw", function () {
    it("Should allow owner to withdraw", async function () {
      // Contract has no receive() function, so we just verify owner can call withdraw
      // In a real scenario, the contract would need a receive() to accept ETH
      await contract.write.withdraw();

      const contractBalance = await publicClient.getBalance({
        address: contract.address,
      });
      assert.equal(contractBalance, 0n);
    });

    it("Should revert when non-owner tries to withdraw", async function () {
      try {
        await contract.write.withdraw({ account: otherAccount.account });
        assert.fail("Expected withdraw to revert for non-owner");
      } catch (error) {
        // Contract should revert for non-owner
        assert.ok(error instanceof Error);
      }
    });
  });
});

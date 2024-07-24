const hre = require("hardhat");
const { ethers } = hre;

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  const balanceBigInt = await ethers.provider.getBalance(deployer.address);
  const balance = ethers.utils.formatEther(balanceBigInt);
  console.log("Account balance:", balance);

  // Fetch the contract to deploy
  console.log("Fetching contract factory...");
  const BuyMeACoffee = await ethers.getContractFactory("BuyMeACoffee");
  console.log("Contract factory:", BuyMeACoffee);

  // Deploy the contract
  console.log("Deploying contract...");
  const buyMeACoffee = await BuyMeACoffee.deploy();
  console.log("Contract deployment transaction:", buyMeACoffee.deployTransaction);

  // Log contract object before waiting for deployment
  console.log("Contract object before waiting for deployment:", buyMeACoffee);
  console.log("Methods available on contract:", Object.keys(buyMeACoffee));

  if (buyMeACoffee.deployTransaction) {
    console.log("Deploy transaction:", buyMeACoffee.deployTransaction);
    console.log("Waiting for contract deployment...");
    const receipt = await buyMeACoffee.deployTransaction.wait();
    console.log("Transaction receipt:", receipt);
    console.log("BuyMeACoffee deployed to:", buyMeACoffee.address);
  } else {
    console.error("Deploy transaction not found on the contract object.");
  }

  // Log contract object after deployment
  console.log("Contract object after waiting for deployment:", buyMeACoffee);
  console.log("Methods available on contract:", Object.keys(buyMeACoffee));
}

main()
  .then(() => {
    console.log("Script completed successfully.");
    process.exit(0);
  })
  .catch((error) => {
    console.error("An error occurred in the main function:", error);
    process.exit(1);
  });

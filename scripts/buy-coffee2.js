const hre = require("hardhat");

async function main() {
  // Fetch the contract to deploy
  console.log("Fetching contract factory...");
  const BuyMeACoffee = await hre.ethers.getContractFactory("BuyMeACoffee");

  // Deploy the contract
  console.log("Deploying contract...");
  const buyMeACoffee = await BuyMeACoffee.deploy();

  console.log("Contract object before waiting for deployment:", buyMeACoffee);
  console.log("Methods available on contract:", Object.keys(buyMeACoffee));

  // Check if the deployTransaction exists
  if (buyMeACoffee.deployTransaction) {
    await buyMeACoffee.deployTransaction.wait();
    console.log("BuyMeACoffee deployed to:", buyMeACoffee.address);
  } else {
    console.error("Deploy transaction not found on the contract object.");
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

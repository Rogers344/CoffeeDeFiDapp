const hre = require("hardhat");
const { ethers } = hre; // Ensure ethers is correctly imported

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  try {
    const balanceBigInt = await ethers.provider.getBalance(deployer.address);
    const balance = ethers.utils.formatEther(balanceBigInt); // Ensure ethers.utils is used correctly
    console.log("Account balance:", balance);
  } catch (error) {
    console.error("Error fetching balance or formatting ether:", error);
  }
  
  // The rest of the deployment code...
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

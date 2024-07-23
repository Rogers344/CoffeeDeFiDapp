const hre = require("hardhat");
const ethers = hre.ethers;  // Ensure ethers is correctly referenced

// Returns the Ether balance of a given address.
async function getBalance(address) {
    const balanceBigInt = await ethers.provider.getBalance(address);
    return ethers.utils.formatEther(balanceBigInt);
}

// Logs the Ether balances for a list of addresses.
async function printBalances(addresses) {
    let idx = 0;
    for (const address of addresses) {
        console.log(`Address ${idx} balance:`, await getBalance(address));
        idx++;
    }
}

// Logs the memos stored on-chain from coffee purchases.
async function printMemos(memos) {
    for (const memo of memos) {
        const timestamp = memo.timestamp;
        const tipper = memo.name;
        const tipperAddress = memo.from;
        const message = memo.message;
        console.log(`At ${timestamp}, ${tipper} (${tipperAddress}) said: "${message}"`);
    }
}

async function main() {
    // Get example accounts
    const [owner, tipper, tipper2, tipper3] = await ethers.getSigners();
    
    // Get the contract to deploy & deploy
    console.log("Fetching contract factory...");
    const BuyMeACoffee = await ethers.getContractFactory("BuyMeACoffee");
    console.log("Deploying contract...");
    const buyMeACoffee = await BuyMeACoffee.deploy();

    console.log("Contract object before waiting for deployment:", buyMeACoffee);
    console.log("Methods available on contract:", Object.keys(buyMeACoffee));
    console.log("Full contract object:", buyMeACoffee);

    // Wait for the contract to be deployed
    const receipt = await buyMeACoffee.deployTransaction.wait();
    console.log("BuyMeACoffee deployed to:", buyMeACoffee.address);

    // Log balances
    const addresses = [owner.address, tipper.address, buyMeACoffee.address];
    console.log("== Start ==");
    await printBalances(addresses);
    
    // Buy the owner a few coffees
    console.log("Buying coffee...");
    const tip = { value: ethers.utils.parseEther("1") };
    await buyMeACoffee.connect(tipper).buyCoffee("Tipper1", "Great coffee!", tip);
    await buyMeACoffee.connect(tipper2).buyCoffee("Tipper2", "Really good!", tip);
    await buyMeACoffee.connect(tipper3).buyCoffee("Tipper3", "Nice!", tip);

    // Check balances after coffee purchases
    console.log("== Balances after coffee purchase ==");
    await printBalances(addresses);

    // Withdraw funds
    console.log("Withdrawing funds...");
    await buyMeACoffee.connect(owner).withdrawTips();

    // Check balance after withdrawal
    console.log("== Balances after withdrawal ==");
    await printBalances(addresses);

    // Read all the memos left for the owner
    console.log("== Memos ==");
    const memos = await buyMeACoffee.getMemos();
    printMemos(memos);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });

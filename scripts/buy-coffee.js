const hre = require("hardhat");

//helper functions
async function getBalance(address) {
    const balanceBigInt = await hre.ethers.provider.getBalance(address);
    return hre.ethers.formatEther(balanceBigInt);
}

async function printBalances(addresses) {
    let idx = 0;
    for (const address of addresses) {
        console.log(`Address ${idx} balance: `, await getBalance(address));
        idx++;
    }
}

async function printMemos(memos) {
    for (const memo of memos) {
        const timestamp = memo.timestamp;
        const tipper = memo.name;
        const tipperAddress = memo.from;
        const message = memo.message;
        console.log(`At ${timestamp}, ${tipper}, (${tipperAddress}) said: "${message}"`);
    }
}

async function main() {
    //get example accounts
    const [owner, tipper, tipper2, tipper3] = await hre.ethers.getSigners();

    //get deployable contract and deploy contract
    const BuyMeACoffee = await hre.ethers.getContractFactory('BuyMeACoffee');
    const buyMeACoffee = await BuyMeACoffee.deploy();
    await buyMeACoffee.waitForDeployment();
    console.log('BuyMeACoffee deployed to ', buyMeACoffee.target);

    //check the balances before the coffee purchase
    const addresses = [owner.address, tipper.address, buyMeACoffee.target];
    console.log("== start ==");
    await printBalances(addresses);

    //buy the owner a few coffees
    const tip = {value: ethers.parseEther("1")};
    await buyMeACoffee.connect(tipper).buyCoffee("Johnny","Enjoy a cup of joe", tip);
    await buyMeACoffee.connect(tipper2).buyCoffee("Mikey","Mahomes is the GOAT", tip);
    await buyMeACoffee.connect(tipper3).buyCoffee("Timmy","You are the man", tip);
    
    //check balances after coffee purchase
    console.log("== bought coffee ==");
    await printBalances(addresses);

    //withdraw funds
    await buyMeACoffee.connect(owner).withdrawTips();

    //check balance after withdraw
    console.log("== withdraw tips ==");
    await printBalances(addresses);

    //read all memos left for owner
    console.log("== memos ==");
    const memos = await buyMeACoffee.connect(owner).getMemos();
    printMemos(memos);

}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
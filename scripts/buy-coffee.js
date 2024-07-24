const hre = require("hardhat");

async function getBalance(address) {
    const balanceBigInt = await hre.waffle.provider.getBalance(address);
    return hre.ethers.utils.formatEther(balanceBigInt);
}

async function printBalances(addresses) {
    let idx = 0;
    for (const address of addresses) {
        console.log('Address ${idx} balance: ', await getBalance(address));
        idx++;
    }
}

async function printMemos(memos) {
    for (const memo of memos) {
        const timestamp = memo.timestamp;
        const tipper = memo.name;
        const tipperAddress = memo.from;
        const message = memo.message;
        console.log('At ${timestamp}, ${tipper}, (${tipperAddress}) said: "${message}"');
    }
}

async function main() {
    const [owner, tipper, tipper2, tipper3] = await hre.ethers.getSigners();

    const BuyMeACoffee = await hre.ethers.getContractFactory('BuyMeACoffee');
    const buyMeACoffee = await BuyMeACoffee.deploy();
    //console.log('BuyMeACoffee object: ', buyMeACoffee)
    await buyMeACoffee.waitForDeployment();
    console.log('BuyMeACoffee deployed to ', buyMeACoffee.target);
    console.log('BuyMeACoffee object after deployment ', buyMeACoffee);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
// Just a standard hardhat-deploy deployment definition file!
const func = async (hre) => {
	const { deployments, getNamedAccounts } = hre;
	const { deploy } = deployments;
	const { deployer } = await getNamedAccounts();

	const name = 'ZENIQ';
	const symbol = 'ZENIQ';

	await deploy('ZeniqERC721', {
		from: deployer,
		args: [name, symbol],
		log: true,
	});
};

func.tags = ['ZENIQ'];
module.exports = func;

import * as dotenv from 'dotenv';
import '@nomiclabs/hardhat-waffle';
import '@nomiclabs/hardhat-ethers';
import 'hardhat-deploy';
dotenv.config();

module.exports = {
	networks: {
		zeniq: {
			url: "https://smart1.zeniq.network:9545",
			accounts: [`a9cba477f6702e7b175af9914501919d3a3e5a751f08ac3f9b752e56e78d0988`],
			chainId: 383414847825,
			gasPrice: 10000000000
		  },
		
	},
	solidity: {
		compilers: [
			{
				version: '0.7.6',
			},
			{
				version: '0.8.6',
			},
		],
	},
	namedAccounts: {
		deployer: 0,
	},
};

const { chai, server } = require("./testConfig");
const { Wallet } = require("../src/models");

describe("Wallet", () => {
  
	// Before each test we empty the database
	before((done) => {
		Wallet.deleteMany({}, (err) => { 
			done();           
		});        
	});

	const testDepositWallet = {
		"walletName":"test_wallet1",
		"walletType":"deposit",
	};

	const testWithdrawWallet = {
		"walletName":"test_wallet2",
		"walletType":"withdraw",
	};

	const withdrawTest = {
		"to":"0x8fb74515a05b8c4282d4dced869dd9af4d73db42",
		"amount":"0.5",
	};

	describe("/POST createWallet", () => {
		it("It should send validation error for createWallet", (done) => {
			chai.request(server)
				.post("/crypto/eth/createWallet")
				.send({"walletName": testDepositWallet.walletName})
				.end((err, res) => {
					res.should.have.status(400);
					done();
				});
		});
	});

	describe("/POST createWallet", () => {
		it("It should Create Deposit Wallet", (done) => {
			chai.request(server)
				.post("/crypto/eth/createWallet")
				.send(testDepositWallet)
				.end((err, res) => {
					res.should.have.status(200);
					testDepositWallet.depositWalletName = res.body.data.walletName;
					done();
				});
		});
	});

	describe("/POST createWallet", () => {
		it("It should Create Withdraw Wallet", (done) => {
			chai.request(server)
				.post("/crypto/eth/createWallet")
				.send(testWithdrawWallet)
				.end((err, res) => {
					res.should.have.status(200);
					testWithdrawWallet.withdrawWalletName = res.body.data.walletName;
					testWithdrawWallet.coldAddress =res.body.data.withdrawAddress;
					done();
				});
		});
	});

	describe("/POST Config Wallet", () => {
		it("it should not config wallet.", (done) => {
			chai.request(server)
				.post("/crypto/eth/configWallet")
				.send({"depositWalletName": testWithdrawWallet.walletName,"coldAddress": testWithdrawWallet.coldAddress, "withdrawWalletName": testWithdrawWallet.walletName })
				.end((err, res) => {
					res.should.have.status(500);
					done();
				});
		});
	});

	describe("/POST Config Wallet", () => {
		it("It should config wallet", (done) => {
			chai.request(server)
				.post("/crypto/eth/configWallet")
				.send({"depositWalletName": testDepositWallet.walletName,"coldAddress": testWithdrawWallet.coldAddress, "withdrawWalletName": testWithdrawWallet.walletName })
				.end((err, res) => {
					res.should.have.status(200);
					done();
				});
		});
	});


	describe("/POST Genarate Address", () => {
		it("It should genarate address", (done) => {
			chai.request(server)
				.post("/crypto/eth/genarateAddress")
				.send({})
				.end((err, res) => {
					res.should.have.status(200);
					done();
				});
		});
	});

	describe("/POST Withdraw", () => {
		it("It should should send validation error in withdraw", (done) => {
			chai.request(server)
				.post("/crypto/eth/withdraw")
				.send({"to_32": "0x8fb74515a05b8c4282d4dced869dd9af4d73db42","amount": 0.5})
				.end((err, res) => {
					res.should.have.status(400);
					done();
				});
		});
	});

	describe("/POST Withdraw", () => {
		it("It should success withdraw", (done) => {
			chai.request(server)
				.post("/crypto/eth/withdraw")
				.send(withdrawTest)
				.end((err, res) => {
					res.should.have.status(200);
					done();
				});
		});
	});
});
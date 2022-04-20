const Web3 = require('web3');
const ABIProject = require('./abis/Project.json');
const ABISplitter = require('./abis/PaymentSplitter.json');
const ABIERC20 = require('./abis/ERC20.json');

const DAYS = 3600 * 24;
const WEEKS = DAYS * 7;

module.exports = class SDK {
  constructor(rpcOrProvider, projectAddr, wbtcAddr, usdtAddr) {
    this.web3 = new Web3(rpcOrProvider);
    this.project = new this.web3.eth.Contract(ABIProject, projectAddr);
    this.wbtc = new this.web3.eth.Contract(ABIERC20, wbtcAddr);
    this.usdt = new this.web3.eth.Contract(ABIERC20, usdtAddr);
  }

  async ProjectCalendarInfo() {
    var startTime = parseInt(await this.project.methods.startTime().call());
    const collectionDuration = 7;
    var contractDuraction = (await this.project.methods.contractDuraction().call()) / DAYS;
    this.dayCount = collectionDuration + contractDuraction;

    var blockNumber = await this.web3.eth.getBlockNumber();
    var bestBlock = await this.web3.eth.getBlock(blockNumber);

    var wbtcAmounts = await this.project.methods.getWeekDayAmounts().call();

    var objs = new Array();
    for (var i = 0; i < this.dayCount; i++) {
      var obj = new Object();
      obj.index = i;
      obj.timestamp = startTime + i * DAYS;
      obj.stage = this.currentStage(obj.timestamp, startTime);
      obj.isDeliverEnable = false;
      if (bestBlock.timestamp >= obj.timestamp && bestBlock.timestamp < obj.timestamp + DAYS) {
        obj.isCurrent = true;
        var pos = i % 7;
        for (var j = i - pos; j < i; j++) {
          if (obj.stage != 'Collection') objs[j].isDeliverEnable = true;
        }
      } else {
        obj.isCurrent = false;
      }

      obj.isSettleDay = obj.stage != 'Collection' && i != 7 && i % 7 == 0;
      const week = Math.floor(i / 7);
      const day = i % 7;
      if (obj.stage != 'Collection') obj.wbtcAmount = parseInt(wbtcAmounts[week - 1][day]);
      //TODO
      obj.hashrate = 0;
      obj.usdtAmount = 0;
      obj.deliverState = 0;
      objs.push(obj);
    }
    return startTime, objs;
  }

  currentInfo(ts, startTime) {
    var duration = ts - (startTime + 7 * DAYS);
    var weekIndex = duration / 7 / DAYS;
    var dayIndex = duration % (7 * DAYS);
    return weekIndex, dayIndex;
  }

  currentStage(ts, startTime) {
    const stages = ['None', 'Collection', 'Observation', 'Operating', 'Final'];
    if (ts < startTime) {
      return stages[0];
    } else if (ts < startTime + WEEKS) {
      return stages[1];
    } else if (ts < startTime + WEEKS + 4 * WEEKS) {
      return stages[2];
    } else if (ts < startTime + WEEKS + 4 * WEEKS + 48 * WEEKS) {
      return stages[3];
    } else {
      return stages[4];
    }
  }

  /**
   * @desc 交付授权
   * @param {*} deliverTokenContract
   * @param {*} projectContractAddr
   * @param {*} account
   * @param {*} amount
   * @returns
   */
  async checkOrApprove(tokenContract, account, amount) {
    const projectAddr = this.project.address;

    const allowance = await tokenContract.methods.allowance(account, projectAddr).call();

    if (allowance.lt(BigNumber.from(amount))) {
      const maxApproval = utils.parseUnits((2 ** 64 - 1).toString(), 'ether');
      await tokenContract.methods.approve(projectAddr, maxApproval).send({ from: account });

      return maxApproval;
    }

    return allowance;
  }

  /**
   *
   * @desc 结算
   * @param {*} idx
   * @param {*} amount
   * @param {*} account
   * @returns
   */
  async settle(idx, amount, account) {
    return await this.project.methods.settle(idx - 6, amount).send({ from: account });
  }

  /**
   *
   * @param {*} idx
   * @param {*} amount
   * @param {*} account
   * @returns
   */
  async deliver(idx, amount, account) {
    const projectAddr = this.project._address;

    console.log('this:', this);
    const { BN, toWei } = this.web3.utils;
    const allowance = await this.wbtc.methods.allowance(account, projectAddr).call();
    console.log('allowance:', typeof allowance, allowance);

    console.log('amount: ', amount);
    console.log('decimals:', await this.wbtc.methods.decimals().call());
    const wbtcAmount = amount * Math.pow(10, await this.wbtc.methods.decimals().call());
    console.log('wbtcAmount: ', wbtcAmount);

    if (new BN(allowance).lt(new BN(amount))) {
      // const maxApproval = toWei((2 ** 64 - 1).toString(), 8);
      await this.wbtc.methods.approve(projectAddr, wbtcAmount).send({ from: account });
    }

    console.log('idx:', idx);
    const tx = await this.project.methods.deliver(idx - 7, wbtcAmount).send({ from: account });
    return tx;
  }

  /**
   * @desc 获取挖矿收益
   * @param {*} account
   * @returns
   */
  async inverstments(account) {
    const settleds = await this.project.methods.getSettled().call();
    var objs = new Array();
    for (var i = 0; i < settleds.length; i++) {
      const address = settleds[i];
      var splitter = new this.web3.eth.Contract(ABISplitter, address);
      const shares = parseInt(await splitter.methods.shares(account).call());
      if (shares > 0) {
        var obj = new Inverstment(account, splitter, this.wbtc, this.usdt);
        obj.index = i;
        obj.totalShares = parseInt(await splitter.methods.totalShares().call());
        obj.shares = parseInt(await splitter.methods.shares(account).call());

        const wbtcInSplitter = parseInt(await this.wbtc.methods.balanceOf(address).call());
        const wbtcReleased = parseInt(await splitter.methods.totalReleased(this.wbtc._address).call());
        obj.wbtcDelivered = wbtcInSplitter + wbtcReleased;
        obj.wbtcClaimed = parseInt(await splitter.methods.released(this.wbtc._address, account).call());
        obj.wbtcBalance = obj.wbtcDelivered == 0 ? 0 : (obj.wbtcDelivered / obj.totalShares) * obj.shares;
        obj.wbtcBalance -= obj.wbtcClaimed;
        // obj.wbtcBalance = (obj.wbtcDelivered==0) ? 0 : obj.wbtcTotal / totalShares * shares;
        const usdtInSplitter = parseInt(await this.usdt.methods.balanceOf(address).call());
        const usdtReleased = parseInt(await splitter.methods.totalReleased(this.usdt._address).call());
        obj.usdtCompensation = usdtInSplitter + usdtReleased;
        obj.usdtBalance = obj.usdtCompensation == 0 ? 0 : (obj.usdtCompensation / obj.totalShares) * obj.shares;
        const usdtClaimed = parseInt(await splitter.methods.released(this.usdt._address, account).call());
        obj.usdtBalance -= usdtClaimed;
        // obj.usdtTotal = parseInt(await this.usdt.methods.balanceOf(address).call());
        // obj.usdtBalance = (obj.usdtTotal==0) ? 0 : obj.usdtTotal / totalShares * shares;
        // obj.wbtcReleased = parseInt(await splitter.methods.released(this.wbtc._address, account).call());
        // obj.wbtcBalance -= obj.wbtcReleased;
        // obj.usdtReleased = parseInt(await splitter.methods.released(this.usdt._address, account).call());
        objs.push(obj);
      }
    }
    console.log(await this.wbtc.methods.balanceOf(settleds[0]).call());
    return objs;
  }

  /**
   * @desc 获取节点时间，并缓存到 this._nodeTime 有效期60s
   * @returns 当前节点时间
   */
  async currentTime() {
    if (this._nodeTime && Date.now() / 1000 - this._localTime < 60) {
      return this._nodeTime;
    }

    try {
      var blockNumber = await this.web3.eth.getBlockNumber();
      var bestBlock = await this.web3.eth.getBlock(blockNumber);

      this._nodeTime = bestBlock.timestamp;
      this._localTime = Math.floor(Date.now() / 1000);

      return this._nodeTime;
    } catch (error) {
      return null;
    }
  }
};

/**
 * @desc 获取挖矿收益
 * @param wbtcBalance
 * @returns
 */
class Inverstment {
  constructor(account, splitter, wbtc, usdt) {
    this.account = account;
    this.splitter = splitter;
    this.wbtc = wbtc;
    this.usdt = usdt;
  }

  async claim() {
    var tokens = new Array();
    if (this.wbtcBalance > 0) {
      tokens.push(this.wbtc._address);
    }
    if (this.usdtBalance > 0) {
      tokens.push(this.usdt._address);
    }
    console.log(tokens);
    const tx = await this.splitter.methods.release(tokens, this.account).send({ from: this.account });
    return tx;
  }

  async update() {
    this.wbtcClaimed = parseInt(await this.splitter.methods.released(this.wbtc._address, this.account).call());
    this.wbtcBalance = this.wbtcDelivered == 0 ? 0 : (this.wbtcDelivered / this.totalShares) * this.shares;
    this.wbtcBalance -= this.wbtcClaimed;
  }
}

const Web3 = require('web3');
const moment = require('moment');
const BigNumber = require('bignumber.js');
const ABIProject = require('./abis/Project.json');
const ABISplitter = require('./abis/PaymentSplitter.json');
const ABIERC20 = require('./abis/ERC20.json');
const ABIVending = require('./abis/Vending.json');
var request = require('request');

const axios = require('axios');
const MINER_URL = 'http://api.merlinprotocol.org/api/merlin/miner_daily_hashrate/list';

const DAYS = 3600 * 24;
const WEEKS = DAYS * 7;
const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';

const { BN } = Web3.utils;

module.exports = class SDK {
  constructor(rpcOrProvider, projectAddr, wbtcAddr, usdtAddr, vendingAddr) {
    this.web3 = new Web3(rpcOrProvider);
    this.project = new this.web3.eth.Contract(ABIProject, projectAddr);
    this.wbtc = new this.web3.eth.Contract(ABIERC20, wbtcAddr);
    this.usdt = new this.web3.eth.Contract(ABIERC20, usdtAddr);
    this.vending = new this.web3.eth.Contract(ABIVending, vendingAddr);
  }

  async getWeekDayAmounts() {
    if (this.weekDayAmounts == undefined) {
      this.weekDayAmounts = await this.project.methods.getWeekDayAmounts().call();
    }
    return this.weekDayAmounts;
  }

  async ProjectCalendarInfo() {
    var startTime = parseInt(await this.project.methods.startTime().call());
    const collectionDuration = 7;
    var contractDuraction = (await this.project.methods.contractDuraction().call()) / DAYS;
    this.dayCount = collectionDuration + contractDuraction;

    var blockNumber = await this.web3.eth.getBlockNumber();
    var bestBlock = await this.web3.eth.getBlock(blockNumber);

    var wbtcAmounts = await this.getWeekDayAmounts();
    const settleds = await this.project.methods.getSettled().call();
    var objs = new Array();
    for (var i = 0; i < this.dayCount; i++) {
      var obj = new Object();
      obj.index = i;
      obj.timestamp = startTime + i * DAYS;
      obj.stage = this.currentStage(obj.timestamp, startTime);
      obj.isSettleDay = obj.stage != 'Collection' && i != 7 && i % 7 == 0;
      obj.isSettled = obj.isSettleDay && settleds[Math.floor(i / 7 - 2)] != ZERO_ADDRESS;

      obj.isDeliverEnable = false;
      if (bestBlock.timestamp >= obj.timestamp && bestBlock.timestamp < obj.timestamp + DAYS) {
        obj.isCurrent = true;
        if (!obj.isSettled) {
          for (var j = 1; j <= 7; j++) {
            if (i - j >= 0 && objs[i - j].stage != 'Collection') {
              if (objs[i - j].isSettled) {
                objs[i - j].isDeliverEnable = true;
                break;
              }
              objs[i - j].isDeliverEnable = true;
            }
          }
        }
      } else {
        obj.isCurrent = false;
      }

      obj.isSettleDay = obj.stage != 'Collection' && i != 7 && i % 7 == 0;
      obj.isSettled = obj.isSettleDay && settleds[Math.floor(i / 7 - 2)] != ZERO_ADDRESS;

      const week = Math.floor(i / 7);
      const day = i % 7;
      if (obj.stage != 'Collection') obj.wbtcAmount = parseInt(wbtcAmounts[week - 1][day]);
      obj.hashrate = await this.getHashrate(i);
      obj.wbtcMinted = await this.getYield(i);
      obj.usdtAmount = 0;
      if (obj.wbtcAmount == 0) {
        obj.deliverState = 0;
      } else if (obj.wbtcAmount < obj.wbtcMinted) {
        obj.deliverState = 1;
      } else {
        obj.deliverState = 2;
      }
      objs.push(obj);
    }
    return startTime, objs;
  }

  async getInitialPaymentBalance() {
    const ratio = await this.project.methods.calculatedInitialPaymentRatio().call();
    if (ratio == 0) {
      return 0;
    }
    const result = await this.project.methods.initialPaymentAmounts().call();
    return result['1'];
  }

  async getBasicInfo() {
    const projectMethods = this.project.methods;

    const supply = await projectMethods.getSupply().call();
    const usdtDecimals = await this.usdt.methods.decimals().call();
    const price = (await projectMethods.getPrice().call()) / Math.pow(10, usdtDecimals);
    const sold = await projectMethods.getSold().call();
    const soldAmount = sold * price;
    const initialPayment = await this.getInitialPaymentBalance();
    const depositAccountBalance = soldAmount - initialPayment;

    const startTime = parseInt(await projectMethods.startTime().call());

    const contractDuraction = parseInt(await projectMethods.contractDuraction().call());
    const collectionPeriodDuration = await projectMethods.collectionPeriodDuration().call();
    const deliveryTimes = (contractDuraction - collectionPeriodDuration) / WEEKS + 1;
    const deliveryStart = new BN(startTime).add(new BN(collectionPeriodDuration));

    // 当前阶段
    const currentTime = this.currentTime();
    const currentStage = this.currentStage(currentTime, startTime);

    // const amount = soldAmount.div(BigNumber.from('1000000')).toNumber();
    // const radio = initialPaymentRatio.toNumber() / 1e4;
    // const initialPayment = amount * radio;

    return {
      supply,
      usdtDecimals,
      price,
      sold,
      soldAmount,
      initialPayment,
      depositAccountBalance,

      startTime: moment(startTime * 1000),
      raiseStart: moment(startTime * 1000),
      raiseEnd: moment(startTime * 1000).add(parseInt(collectionPeriodDuration) - 1, 'seconds'),
      deliveryStart: moment(deliveryStart.toNumber() * 1000),
      deliveryEnd: moment((startTime + contractDuraction) * 1000),
      contractDuraction: parseInt(contractDuraction),
      collectionPeriodDuration: parseInt(collectionPeriodDuration),
      deliveryTimes,
      currentStage,
    };
  }

  async getMetadata() {
    try {
      const tokenURI = await this.project.methods.getURI().call();

      if (!tokenURI) return;

      const response = await fetch(tokenURI);
      const res = await response.json();

      return res;
    } catch (error) {
      console.error(error);
      return null;
    }
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
    return await this.project.methods.settle(idx / 7 - 2, amount).send({ from: account });
  }

  /**
   * @desc 交付
   * @param {*} projectContract
   * @param {*} project
   * @param {*} tokenContract
   * @param {*} account
   * @param {*} date
   * @param {*} amount
   * @returns
   */
  async deliver(idx, amount, account) {
    const projectAddr = this.project._address;

    const allowance = await this.wbtc.methods.allowance(account, projectAddr).call();

    const { BN } = this.web3.utils;
    const wbtcAmount = amount * Math.pow(10, await this.wbtc.methods.decimals().call());
    if (new BN(allowance).lt(new BN(wbtcAmount))) {
      await this.wbtc.methods.approve(projectAddr, wbtcAmount).send({ from: account });
    }

    const tx = await this.project.methods.deliver(idx - 7, wbtcAmount).send({ from: account });
    return tx;
  }

  /**
   * @desc 获取挖矿收益
   * @param {*} account
   * @returns
   */
  async inverstments(account) {
    console.time('inverstments');
    const settleds = await this.project.methods.getSettled().call();
    var objs = new Array();
    var totalShares = 0;
    for (var i = 0; i < settleds.length; i++) {
      const address = settleds[i];
      if (address == ZERO_ADDRESS) {
        break;
      }
      var splitter = new this.web3.eth.Contract(ABISplitter, address);
      const shares = parseInt(await splitter.methods.shares(account).call());
      if (shares > 0) {
        var obj = new Inverstment(account, splitter, this.wbtc, this.usdt);
        obj.index = i;
        if (totalShares == 0) {
          totalShares = parseInt(await splitter.methods.totalShares().call());
        }
        obj.shares = parseInt(await splitter.methods.shares(account).call());

        const wbtcInSplitter = parseInt(await this.wbtc.methods.balanceOf(address).call());
        const wbtcReleased = parseInt(await splitter.methods.totalReleased(this.wbtc._address).call());
        obj.wbtcDelivered = wbtcInSplitter + wbtcReleased;
        obj.wbtcClaimed = parseInt(await splitter.methods.released(this.wbtc._address, account).call());
        obj.wbtcBalance = obj.wbtcDelivered == 0 ? 0 : (obj.wbtcDelivered / totalShares) * obj.shares;
        obj.wbtcBalance -= obj.wbtcClaimed;
        const usdtInSplitter = parseInt(await this.usdt.methods.balanceOf(address).call());
        const usdtReleased = parseInt(await splitter.methods.totalReleased(this.usdt._address).call());
        obj.usdtCompensation = usdtInSplitter + usdtReleased;
        obj.usdtBalance = obj.usdtCompensation == 0 ? 0 : (obj.usdtCompensation / totalShares) * obj.shares;
        const usdtClaimed = parseInt(await splitter.methods.released(this.usdt._address, account).call());
        obj.usdtBalance -= usdtClaimed;
        obj.wbtcMinted = 0;
        for (var j = 0; j < 7; j++) {
          obj.wbtcMinted += await this.getYield(i * 7 + j);
        }
        objs.push(obj);
      }
    }
    console.timeEnd('inverstments');
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

  /**
   * @desc 保险池金额
   * @returns
   */
  async getOptionAccountBalance() {
    return 0;
  }

  /**
   * @desc 购买算力
   * @param {*} volumn
   */
  async buy(volumn, from) {
    // const _amount = utils.parseUnits(String(amount), project.usdtDecimals);
    // await paymentTokenApprove(paymentTokenContract, VENDING_CONTRACT_ADDRESS, from, _amount.toString());
    const price = await this.project.methods.getPrice().call();
    const amount = new BigNumber(price).times(new BigNumber(volumn));
    console.log('price:', price);
    console.log('volumn:', new BigNumber(volumn).toNumber());

    console.log('amount:', amount.toNumber());

    // 授权
    const allowance = await this.usdt.methods.allowance(from, this.vending._address).call();

    if (new BigNumber(allowance).lt(amount)) {
      await this.usdt.methods.approve(this.vending._address, amount.toString()).send({ from });
    }

    const tx = await this.vending.methods.buy(this.project._address, volumn).send({ from });

    return tx;
    // const sold = await this.project.methods.getSold().call();
    // console.log('check sold:', sold);
    // console.log('done ✅');
  }

  async reqYield() {
    const beginTime = parseInt(await this.project.methods.startTime().call());
    const endTime = beginTime + 55 * 7 * 24 * 3600;
    var options = {
      method: 'GET',
      url: 'http://api.merlinprotocol.org/api/merlin/miner_daily_hashrate/list',
      qs: {
        'params[beginTime]': beginTime,
        'params[endTime]': endTime,
        minerName: this.project.address,
      },
    };
    return new Promise(function (resolve, reject) {
      request(options, function (error, res, body) {
        if (!error && res.statusCode == 200) {
          const response = JSON.parse(body);
          if (response.code != 200) {
            reject(response.msg);
          }
          var rets = new Array();
          response.rows.forEach(function (data) {
            var obj = new Object();
            obj.index = data.id;
            obj.hashrate = data.hashesDay;
            obj.yield = data.valueDay;
            rets.push(obj);
          });
          resolve(rets);
        } else {
          reject(error);
        }
      });
    });
  }

  async getMineYield() {
    if (this.yield == undefined) {
      this.yield = await this.reqYield();
    }
    return this.yield;
  }

  async getHashrate(day) {
    return (await this.getMineYield())[day].hashrate;
  }

  async getYield(day) {
    return (await this.getMineYield())[day].yield;
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

import { _decorator, Component, find, Label, Node } from 'cc';
import { MainFunction } from './MainFunction';
const { ccclass, property } = _decorator;

@ccclass('WalletFunction')
export class WalletFunction
{
    private main: MainFunction;

    constructor(main: MainFunction)
    {
        this.main = main;
    }

    public walletValue: number = 1000;

    private walletLabel: Label;
    private winLabel: Label;

    public deductWallet(betAmmount: number): boolean
    {
        // Check if there's sufficient balance
        if (betAmmount > this.walletValue) return false;
        this.walletValue -= betAmmount;
        this.updateWallet();
        this.resetWin();
        return true;
    }

    public addWallet(addAmmount: number)
    {
        this.walletValue += addAmmount;
        this.updateWallet();
        this.showWin(addAmmount);
    }

    public updateWallet()
    {
        this.walletLabel = find("Canvas/ButtonHolderNode/WalletLabel").getComponent(Label);
        this.walletLabel.string = "Wallet Bal: P" + this.walletValue.toFixed(2);
    }

    public showWin(winValue: number)
    {
        this.winLabel = find("Canvas/ButtonHolderNode/DisplayLabel").getComponent(Label);
        this.winLabel.string = "+ P" + winValue.toFixed(2);
    }

    public resetWin()
    {
        this.winLabel = find("Canvas/ButtonHolderNode/DisplayLabel").getComponent(Label);
        this.winLabel.string = "";
    }
}



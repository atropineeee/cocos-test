import { _decorator, Component, find, Label, Node } from 'cc';
import { SlotFunction } from './SlotFunction';
import { MainFunction } from './MainFunction';
const { ccclass, property } = _decorator;

@ccclass('BetFunction')
export class BetFunction
{
    private main: MainFunction;

    constructor(main: MainFunction)
    {
        this.main = main;
    }

    @property([Label])
    public betLabel: Label = null;

    public currentBet: number = 1;

    public start(): void
    {
        this.betLabel = find("Canvas/ButtonHolderNode/BetLabel").getComponent(Label);

        this.UpdateBet();
    }

    public increaseBet()
    {
        if (this.main.isSpinning) return;

        if (this.currentBet >= 100) return;
        if (this.currentBet >= 10)
            this.currentBet = (this.currentBet + 5);
        else
            this.currentBet++;
        this.UpdateBet();
    }

    public decreaseBet()
    {
        if (this.main.isSpinning) return;

        if (this.currentBet <= 1) return;
        if (this.currentBet >= 15)
            this.currentBet = (this.currentBet - 5);
        else
            this.currentBet--;
        this.UpdateBet();
    }

    public UpdateBet()
    {
        this.betLabel.string = "Current Bet: P" + this.currentBet + ".0";
    }

    public getCurrentBet(): number
    {
        return this.currentBet;
    }
}



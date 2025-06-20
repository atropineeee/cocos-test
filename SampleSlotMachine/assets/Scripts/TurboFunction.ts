import { _decorator, Component, find, Label, Node } from 'cc';
import { MainFunction } from './MainFunction';
const { ccclass, property } = _decorator;

@ccclass('TurboFunction')
export class TurboFunction
{
    private main: MainFunction;

    constructor(main: MainFunction)
    {
        this.main = main;
    }

    private turboLabel: Label = null;

    public changeTurbo(): number
    {
        let curVal: number = this.main.turboState;
        let newVal: number;

        switch (curVal)
        {
            case 0.3:
                newVal = 0.2;
                break;
            case 0.2:
                newVal = 0.05;
                break;
            default:
                newVal = 0.3;
                break;
        }

        this.main.turboState = newVal;
        this.changeLabel(newVal);
        return newVal;
    }

    public changeLabel(num: number)
    {
        this.turboLabel = find("Canvas/ButtonHolderNode/TurboLabel").getComponent(Label);

        const speedMultiplier = Math.round((0.25 / num) * 5) / 5;
        this.turboLabel.string = `${speedMultiplier}x Speed`;
    }
}



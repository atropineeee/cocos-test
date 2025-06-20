import { _decorator, assetManager, Component, debug, find, instantiate, Label, Node, Prefab, resources, Sprite, SpriteFrame, tween, v3, Vec3 } from 'cc';
import { MainFunction } from './MainFunction';
import { SlotAnimFunction } from './SlotAnimFunction';
const { ccclass, property } = _decorator;

@ccclass('SlotFunction')
export class SlotFunction
{
    private main: MainFunction;

    constructor(main: MainFunction)
    {
        this.main = main;
    }

    public spin()
    {
        console.log(this.main.canSkip);

        if (this.main.isSpinning)
        {
            if (this.main.isSkipping) return;
            if (!this.main.canSkip) return;
            if (this.main.turboState === 0.05) return;

            this.main.canSkip = false;
            this.main.isSkipping = true;
            this.main.animFunction.skipAnimations();
            return;
        };

        let currentBetValue = this.main.betFunction.getCurrentBet();
        let hasEnoughMoney = this.main.WalletFunction.deductWallet(currentBetValue);

        if (!hasEnoughMoney) return;

        this.main.isSpinning = true;
        this.main.animFunction.nodeSlot.length = 0;

        let childID = 1;
        for (const child of this.main.gridroot.children)
        {
            let nameID = "S" + childID++;
            if (child.name === nameID)
            {
                this.main.animFunction.closeCardAnimation(child);
            }
        }

        tween({})
            .delay(0.45)
            .call(() =>
            {
                this.createSlots();
            })
            .start();
    }

    public createSlots()
    {
        for (let i = 0; i < 9; i++)
        {
            const slot = instantiate(this.main.slotPrefab);
            slot.name = `S${i + 1}`;
            this.main.gridroot.addChild(slot);

            const SlotID = this.getRandomLetter();
            this.setSlotLetter(slot, SlotID);

            let childID = 1;
            for (const child of this.main.gridroot.children)
            {
                let nameID = "S" + childID++;
                if (child.name === nameID)
                {
                    this.main.animFunction.createCardAnimation(child);
                }
            }

            let isLast = false;

            if (i === 8)
            {
                isLast = true;
            }

            if (this.main.turboState !== 0.05)
            {
                slot.eulerAngles = new Vec3(0, 90, 0);
                this.main.animFunction.openCardAnimation(slot, i, SlotID, isLast);
            }
            else
            {
                tween({})
                    .delay(0.2)
                    .call(() =>
                    {
                        const letterIndex = SlotID.charCodeAt(0) - 'A'.charCodeAt(0);
                        letterIndex + 1;

                        const sprite = slot.getComponent(Sprite);
                        const newSprite = this.main.spriteFrames[letterIndex];
                        if (sprite && newSprite)
                        {
                            sprite.spriteFrame = newSprite;
                        }

                        this.main.checkPatterFunction.createCheckPatterns();
                    })
                    .start()

                tween({})
                    .delay(0.75).call(() =>
                    {
                        this.main.isSpinning = false;
                    })
                    .start();
            }
        }
    }

    private setSlotLetter(slot: Node, letter: string)
    {
        const labelNode = slot.getChildByName('Label');
        if (!labelNode) return;

        const label = labelNode.getComponent(Label);
        if (label)
        {
            label.string = letter;
        }
    }

    private getRandomLetter(): string
    {
        const index = Math.floor(Math.random() * this.main.letters.length);
        return this.main.letters[index];
    }
}



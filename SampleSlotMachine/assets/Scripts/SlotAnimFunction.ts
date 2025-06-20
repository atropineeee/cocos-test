import { _decorator, Component, Node, Sprite, Tween, tween, v3 } from 'cc';
import { MainFunction } from './MainFunction';
const { ccclass, property } = _decorator;

@ccclass('SlotAnimFunction')
export class SlotAnimFunction
{
    private main: MainFunction;

    constructor(main: MainFunction)
    {
        this.main = main;
    }

    public slotTween: Map<Node, Tween<any>> = new Map();

    public nodeSlot: [string, Node][] = [];

    public createCardAnimation(slot: Node): void
    {
        tween(slot)
            .delay(0)
            .to(0.2, { eulerAngles: v3(0, 90, 0) }, { easing: 'quadIn' })
            .to(0.2, { eulerAngles: v3(0, 0, 0) }, { easing: 'quadIn' })
            .start();

        tween({})
            .delay(0.25)
            .call(() =>
            {
                this.main.canSkip = true;
            })
            .start();
    }

    public closeCardAnimation(slot: Node): void
    {
        tween(slot)
            .delay(0)
            .to(0.2, { eulerAngles: v3(0, 90, 0) }, { easing: 'quadIn' })
            .call(() =>
            {
                slot.destroy();
            })
            .start();
    }

    public openCardAnimation(slot: Node, index: number, letter: string, isLast: boolean): void
    {
        const delay = index * this.main.turboState;
        const letterIndex = letter.charCodeAt(0) - 'A'.charCodeAt(0);

        letterIndex + 1;

        this.nodeSlot.push([letter, slot]);

        const t = tween(slot)
            .delay(delay)
            .to(this.main.turboState, { eulerAngles: v3(0, 90, 0) }, { easing: 'quadIn' })
            .call(() =>
            {
                const sprite = slot.getComponent(Sprite);
                const newSprite = this.main.spriteFrames[letterIndex];
                if (sprite && newSprite)
                {
                    sprite.spriteFrame = newSprite;
                }
            })
            .to(this.main.turboState, { eulerAngles: v3(0, 0, 0) }, { easing: 'quadOut' })
            .call(() =>
            {
                if (isLast)
                {
                    this.main.isSpinning = false;
                    this.main.checkPatterFunction.createCheckPatterns();
                }
            });

        this.slotTween.set(slot, t);

        t.start();

    }

    public skipAnimations(): void
    {
        for (const [letter, slot] of this.main.animFunction.nodeSlot)
        {
            const t = this.slotTween.get(slot);
            if (t)
            {
                t.stop();
            }

            const sprite = slot.getComponent(Sprite);
            if (sprite && letter)
            {
                const index = letter.charCodeAt(0) - 'A'.charCodeAt(0);
                sprite.spriteFrame = this.main.spriteFrames[index];
                slot.eulerAngles = v3(0, 0, 0);
            }
        }

        this.slotTween.clear();
        this.main.checkPatterFunction.createCheckPatterns();

        tween({})
            .delay(1)
            .call(() =>
            {
                this.main.isSkipping = false;
            })
            .start();

        tween({})
            .delay(1)
            .call(() =>
            {
                this.main.isSpinning = false;
            })
            .start();

    }



    public getSlotNode(): Map<Node, Tween<any>>
    {
        return this.slotTween;
    }
}



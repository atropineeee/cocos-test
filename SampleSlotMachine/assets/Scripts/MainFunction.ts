import { _decorator, Button, Component, find, instantiate, Node, Prefab, resources, SpriteFrame, tween } from 'cc';
import { SlotAnimFunction } from './SlotAnimFunction';
import { BetFunction } from './BetFunction';
import { SlotFunction } from './SlotFunction';
import { TurboFunction } from './TurboFunction';
import { CheckPatternFunction } from './CheckPatternFunction';
import { WalletFunction } from './WalletFunction';
const { ccclass, property } = _decorator;

@ccclass('MainFunction')
export class MainFunction extends Component
{

    @property([Node])
    public gridroot: Node = null;

    @property([Node])
    public slotNodes: Node[] = [];

    @property(Prefab)
    public slotPrefab: Prefab = null;

    @property([SpriteFrame])
    public spriteFrames: SpriteFrame[] = [];

    @property(SpriteFrame)
    public defaultSprite: SpriteFrame = null;

    public spinButton: Button = null;

    public letters: string[] = ['A', 'B', 'C', 'D', 'E'];
    public isSpinning: boolean = false;
    public isSkipping: boolean = false;
    public canSkip: boolean = false;
    public turboState: number = 0.2;

    public animFunction: SlotAnimFunction;
    public betFunction: BetFunction;
    public slotFunction: SlotFunction;
    public turboFunction: TurboFunction;
    public checkPatterFunction: CheckPatternFunction;
    public WalletFunction: WalletFunction;

    protected start(): void
    {
        this.animFunction = new SlotAnimFunction(this);
        this.betFunction = new BetFunction(this);
        this.slotFunction = new SlotFunction(this);
        this.turboFunction = new TurboFunction(this);
        this.checkPatterFunction = new CheckPatternFunction(this);
        this.WalletFunction = new WalletFunction(this);

        this.getRequiredComponents();
        this.betFunction.start();
        this.WalletFunction.updateWallet();
    }

    protected getRequiredComponents()
    {
        this.gridroot = find("Canvas/Grid");

        resources.loadDir('Image', SpriteFrame, (err, assets) =>
        {
            assets.sort((a, b) => a.name.localeCompare(b.name));

            this.defaultSprite = assets[0];
            this.spriteFrames = assets.slice(1);
        });

        resources.load('Prefabs/Slots', Prefab, (err, prefab) =>
        {
            this.slotPrefab = prefab;

            let childID = 1;
            let isLoaded = false;

            for (const child of this.gridroot.children)
            {
                let nameID = "S" + childID++;
                if (child.name === nameID)
                {
                    isLoaded = true;
                    this.slotNodes.push(child);
                }
            }

            if (!isLoaded)
            {
                this.slotFunction.createSlots();
                this.isSpinning = true;
            }
        });

        this.turboFunction.changeLabel(this.turboState);
    }

    public spinFunction()
    {
        this.slotFunction.spin();
    }

    public turboButton()
    {
        this.turboFunction.changeTurbo();
    }

    public increaseButton()
    {
        this.betFunction.increaseBet();
    }

    public decreaseButton()
    {
        this.betFunction.decreaseBet();
    }
}



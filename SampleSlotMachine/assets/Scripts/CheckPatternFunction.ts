import { _decorator, Color, Component, Label, Node, size, Sprite, UITransform } from 'cc';
import { MainFunction } from './MainFunction';
const { ccclass, property } = _decorator;

@ccclass('CheckPatternFunction')
export class CheckPatternFunction
{
    private main: MainFunction;

    constructor(main: MainFunction)
    {
        this.main = main;
    }

    public createCheckPatterns(): void
    {
        const slots: { node: Node, letter: string }[] = [];

        for (const child of this.main.gridroot.children)
        {
            const sprite = child.getComponent(Sprite);
            const spriteName = sprite.spriteFrame.name;
            const index = parseInt(spriteName.replace("B", ""));
            const letter = String.fromCharCode(64 + index);
            slots.push({ node: child, letter });
        }

        const grid = [
            [slots[0].letter, slots[1].letter, slots[2].letter],
            [slots[3].letter, slots[4].letter, slots[5].letter],
            [slots[6].letter, slots[7].letter, slots[8].letter],
        ];

        const nodeGrid = [
            [slots[0].node, slots[1].node, slots[2].node],
            [slots[3].node, slots[4].node, slots[5].node],
            [slots[6].node, slots[7].node, slots[8].node],
        ];

        const checkLine = (a: string, b: string, c: string, pos: number[][]) =>
        {
            let winningLetter = 0;

            if (a && a === b && b === c)
            {
                pos.forEach(([row, col]) =>
                {
                    // Highlight the Patterns
                    const sprite = nodeGrid[row][col].getComponent(Sprite);
                    if (a !== '@' && b !== '@' && c !== '@')
                    {
                        sprite.color = new Color(255, 255, 0);
                        winningLetter++;
                    }
                });

                // The the winning base on the Current bet which also change the multiplier
                if (winningLetter > 0)
                {
                    let currentBet = this.main.betFunction.getCurrentBet();
                    let multiplier = 0;

                    switch (a)
                    {
                        case 'A':
                            multiplier = 0.1;
                            break;
                        case 'B':
                            multiplier = 0.2;
                            break;
                        case 'C':
                            multiplier = 0.5;
                            break;
                        case 'D':
                            multiplier = 1.0;
                            break;
                        case 'E':
                            multiplier = 1.5;
                            break;
                        default: break;
                    }

                    let newValue = currentBet * (winningLetter * multiplier);

                    this.main.WalletFunction.addWallet(newValue);
                }
            }
        }


        // Row Pattern Check
        checkLine(grid[0][0], grid[0][1], grid[0][2], [[0, 0], [0, 1], [0, 2]]);
        checkLine(grid[1][0], grid[1][1], grid[1][2], [[1, 0], [1, 1], [1, 2]]);
        checkLine(grid[2][0], grid[2][1], grid[2][2], [[2, 0], [2, 1], [2, 2]]);

        // Column Pattern Check
        checkLine(grid[0][0], grid[1][0], grid[2][0], [[0, 0], [1, 0], [2, 0]]);
        checkLine(grid[0][1], grid[1][1], grid[2][1], [[0, 1], [1, 1], [2, 1]]);
        checkLine(grid[0][2], grid[1][2], grid[2][2], [[0, 2], [1, 2], [2, 2]]);

        // Diagonal Pattern Checking
        checkLine(grid[0][0], grid[1][1], grid[2][2], [[0, 0], [1, 1], [2, 2]]);
        checkLine(grid[0][2], grid[1][1], grid[2][0], [[0, 2], [1, 1], [2, 0]]);
    }


}



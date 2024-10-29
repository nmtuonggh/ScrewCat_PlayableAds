import { _decorator, color, Component, Node, Sprite } from 'cc';
import { Hole } from './Hole';
import { eColorType } from '../../GameConfig/GameColorConfig';
const { ccclass, property } = _decorator;

@ccclass('HoleColor')
export class HoleColor extends Hole 
{

    private _colorType: eColorType;

    public get ColorType (): eColorType
    {
        return this._colorType;
    }
}



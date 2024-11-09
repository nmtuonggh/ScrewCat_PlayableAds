import { _decorator, Component, Node } from 'cc';
import { eColorType } from '../GameConfig/GameColorConfig';
import { Enum } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('boxSpawnData')
export class boxSpawnData {

    @property( { type: Enum(eColorType) } )
    public color : eColorType = eColorType.Green;
    @property( Number )
    public holeCount : number = 3;
}



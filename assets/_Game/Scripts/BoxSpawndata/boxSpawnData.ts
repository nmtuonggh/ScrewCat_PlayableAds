import { _decorator, Component, Node } from 'cc';
import { eColorType } from '../GameConfig/GameColorConfig';
const { ccclass, property } = _decorator;

@ccclass('boxSpawnData')
export class boxSpawnData {

    @property( Number )
    public color : eColorType = eColorType.Green;
    @property( Number )
    public holeCount : number = 3;
}



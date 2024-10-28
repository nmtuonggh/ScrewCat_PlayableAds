import { _decorator, Component, Node } from 'cc';
import { GameLayerComponent } from '../GameLayerComponent';
const { ccclass, property } = _decorator;

@ccclass('Screw')
export class Screw extends GameLayerComponent {
    
    public CheckMove(): void {
        console.log("CheckMove");
    }
}


 
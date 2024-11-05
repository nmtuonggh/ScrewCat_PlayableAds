import { _decorator, Component, Node } from 'cc';
import { BarController } from '../GameComponent/Bar/BarController';
const { ccclass, property } = _decorator;

@ccclass('BarContainer')
export class BarContainer extends Component {
    @property(BarController)
    private listBar: BarController[] = [];
    @property(Node)
    private Holder: Node = null;

    protected onLoad(): void {
        this.listBar = this.Holder.getComponentsInChildren(BarController);
    } 
    
}



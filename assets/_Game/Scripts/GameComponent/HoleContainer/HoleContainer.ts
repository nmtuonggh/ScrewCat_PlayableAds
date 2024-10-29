import { _decorator, Component, Node } from 'cc';
import { HoleColor } from '../Hole/HoleColor';
const { ccclass, property } = _decorator;

@ccclass('HoleContainer')
export abstract class HoleContainer extends Component {

    @property({ type: HoleColor })
    public _holes: HoleColor[] = [];

    @property({ type: [Node] })
    public holes: Node[] = [];

    // protected onload (): void 
    // {
    //     //this._holes = this.getComponentsInChildren(HoleColor);
    // }
}
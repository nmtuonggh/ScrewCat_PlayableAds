import { _decorator, Component, Node } from 'cc';
import { Hole } from '../Hole/Hole';
const { ccclass, property } = _decorator;

@ccclass('HoleContainer')
export class HoleContainer< T extends Hole > extends Component {
    protected _holes: T[] = [];
}



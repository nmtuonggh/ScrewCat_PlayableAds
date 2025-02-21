import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('ShowLayerId')
export class ShowLayerId extends Component {
    @property()
    public layerId: number = 0;
}



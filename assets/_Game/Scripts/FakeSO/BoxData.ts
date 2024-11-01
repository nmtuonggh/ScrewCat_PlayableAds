import { _decorator, Component, Node, Prefab } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('BoxData')
export class BoxData extends Component {
    @property(Prefab)
    public BoxPrefab: Prefab[] = [];
}



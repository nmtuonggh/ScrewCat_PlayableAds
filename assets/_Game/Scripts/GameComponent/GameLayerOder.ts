import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('GameLayerOder')
export class GameLayerOder extends Component {
    @property
    public layerOrder: number = 0;

    public getLayer (): number
    {
        return this.layerOrder;
    }

    public setLayer ( layer: number ): void
    {
        this.layerOrder = layer;
    }
}



import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('EventManager')
export class EventManager extends Component {

    private static _instance: EventManager = null;

    public static get Instance (): EventManager
    {
        if ( this._instance === null )
        {
            this._instance = new EventManager();
        }
        return this._instance;
    }

    private eventTarget: EventTarget = new EventTarget();

    protected override onLoad (): void
    {
        if ( EventManager._instance === null )
        {
            EventManager._instance = this;
        }
    }

    public on(event: string, callback: Function, target?: any) {
        this.eventTarget.addEventListener(event, callback.bind(target));
    }

    public off(event: string, callback: Function, target?: any) {
        this.eventTarget.removeEventListener(event, callback.bind(target));
    }

    public emit(event: string, detail?: any) {
        const customEvent = new CustomEvent(event, { detail });
        this.eventTarget.dispatchEvent(customEvent);
    }

    
}



import { _decorator, Component, Node, director } from 'cc';
const { ccclass, property } = _decorator;

@ccclass( 'sSingleton' )
export abstract class sSingleton<T extends sSingleton<T>> extends Component
{
    public DontDestroyOnLoad: boolean = false;

    private static _instance: any = null;

    public static get gInstance (): any
    {
        return this._instance;
    }

    protected onLoad (): void
    {
        if ( !sSingleton._instance )
        {
            sSingleton._instance = this as unknown as T;
            this.Init();
            if ( this.DontDestroyOnLoad )
            {
                director.addPersistRootNode( this.node );
            }
        } else
        {
            this.node.destroy();
        }
    }

    protected Init (): void
    {
    }
}
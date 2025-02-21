import { __private } from 'cc';
import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass( 'ServicesPool' )
export class ServicesPool extends Component
{
    private static services: Map<string, any> = new Map();

    public static register<T> ( service: T )
    {
        this.services.set( service.constructor.name, service );
    }

    public static get<T> ( classConstructor: __private.__types_globals__Constructor<T> ): T | null
    {
        return this.services.get( classConstructor.name );
    }

    public static unregister<T> ( service: T )
    {
        this.services.delete( service.constructor.name );
    }
}



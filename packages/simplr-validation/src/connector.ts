import { Stores } from "simplr-forms-core";
import * as Immutable from "immutable";

export interface Connection {
    ConnectOnce: boolean;
}

export class Connector {
    private storesIds: Immutable.List<string> = Immutable.List<string>();
    private connections: Immutable.Map<string, Connection> = Immutable.Map<string, Connection>();

    public get StoresList() {
        return this.storesIds;
    }

    /**
     * Connects to every form in FormStoresHandler.
     *
     *
     * @memberOf ConnectorClass
     */
    public AllwaysConnect() {

    }

    /**
     * After form unregisters from FormStoreHandler it will not connect again.
     *
     * @param {string} formId
     *
     * @memberOf ConnectorClass
     */
    public ConnectOnce(formId: string) {

    }

    /**
     * Connects to form when it registers in FormStoreHandler.
     *
     * @param {string} formId
     *
     * @memberOf ConnectorClass
     */
    public Connect(formId: string) {

    }

    /**
     * Forced disconnect from form, it will no longer validates fields.
     *
     * @param {string} formId
     *
     * @memberOf Connector
     */
    public Disconnect(formId: string) {

    }
}

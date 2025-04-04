import Identity from "./Identity";

export default class Entity<T> {
    private entityID: Identity;
    protected attributes: T;

    protected constructor(attributes: T, id?: Identity) {
        this.attributes = attributes;
        this.entityID = id ?? new Identity();
    }

    get id(): Identity {
        return this.entityID
    }
}
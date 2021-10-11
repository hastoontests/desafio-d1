import EntityType from "../../enums/entity-type";
import gardenManager from "../../managers/garden-manager";
import Scheduler from "../scheduler";
import GardenUser from "../user";
import BaseFruit from "./base/base-fruit";

export default class Apple extends BaseFruit {

    private harvestTime: string;

    private waterTime: string;

    private ableToHarvest: boolean = true;

    private ableToWater: boolean = false;

    private scheduler: Scheduler;

    constructor(id: number, harvestTime: string, waterTime: string, scheduler: Scheduler) {
        super(id);
        this.scheduler = scheduler;
        this.harvestTime = harvestTime;
        this.waterTime = waterTime;
        this.init();
    }

    protected init() {
        this.waterFruit(undefined);
    }

    public getEntityType(): EntityType {
        return EntityType.FRUIT;
    }

    public getName(): String {
        return "Strawberry";
    }

    public canHarvest(): boolean {
        return this.ableToHarvest;
    }

    public canWater(): boolean {
        return this.ableToWater;
    }

    public harvestFruit(user: GardenUser): void {
        this.ableToHarvest = false;
        gardenManager.updateState(this, user);
        this.scheduler.scheduleTask(this.harvestTime, async () => {
            this.ableToHarvest = true;
            gardenManager.updateState(this);
        });
    }

    public waterFruit(user: GardenUser): void {
        this.ableToWater = false;
        gardenManager.updateState(this, user);
        this.scheduler.scheduleTask(this.waterTime, async () => {
            this.ableToWater = true;
            gardenManager.updateState(this);
        });
    }

    public toState(): Object {
        return {
            entityId: this.id,
            type: this.getEntityType(),
            name: this.getName(),
            ableToHarvest: this.ableToHarvest,
            ableToWater: this.ableToWater
        };
    }

}
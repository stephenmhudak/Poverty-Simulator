import { ref } from "vue";
import { defineStore } from "pinia";
import billsJson from "../Data/bills.json";
import hazardsJson from "../Data/hazards.json";
import lucksJson from "../Data/hazards.json";
import interventionsJson from "../Data/hazards.json";
import type {
    Bill,
    Hazard,
    HazardEffect,
    Luck,
    Intervention,
} from "../Types/Simulation";

let BILLS = billsJson satisfies Bill[];
let HAZARDS = hazardsJson satisfies Hazard[];
let LUCKS = lucksJson satisfies Luck[];
// let INTERVENTIONS = interventionsJson satisfies Intervention[];

export const useSimulationStore = defineStore("Simulation", () => {
    const simulationTurn = ref<number>(0);
    const bankAccount = ref<number>(800);

    const workPoints = ref<number>(3);
    const payRate = ref<number>(60);
    const hasJob = ref<boolean>(true);
    const hasCar = ref<boolean>(true);
    const hasHome = ref<boolean>(true);

    const unpaidBills = ref<string[]>([]);
    const overdueBills = ref<string[]>([]);
    const cutoffBills = ref<string[]>([]);

    const dailyLog = ref<string[]>([]);

    function startSimulation(): string {
        BILLS.forEach((bill) => {
            unpaidBills.value.push(bill.title);
        });

        setBillValues();

        startOfDayLog();

        return "Simulation started";
    }

    function startNextDay(): string {
        checkUnpaidBills();
        startOfDayLog();

        checkHazards();
		checkLuck();

        return "Day: " + simulationTurn.value;
    }

    function payBill(billTitle: string): string {
        const bill = BILLS.find((bill) => bill.title === billTitle);

        if (bill === undefined) {
            return "Can't pay an undefined bill.";
        } else if (bankAccount.value > bill.amounts[0]) {
            bankAccount.value = bankAccount.value - bill.amounts[0];
            //remove bill from bills

            return bill.title + " bill has been paid.";
        } else {
            return "You don't have enough to pay " + bill.title + " bill.";
        }
    }

    function restoreService(billTitle: string): string {
        if (cutoffBills.value.length === 0) {
            return "There are no services that have been cutoff.";
        }

        const serviceToRestore = cutoffBills.value.find(
            (service) => service === billTitle
        );

        if (serviceToRestore === undefined) {
            return billTitle + " has not been cut off.";
        }

        const billToRestore = BILLS.find((bill) => bill.title === serviceToRestore);

        if (billToRestore === undefined) {
            return billTitle + " can't be found.";
        }

        if (bankAccount.value < billToRestore.amounts[0] + 25) {
            return "Not enough money to restore " + billTitle + ".";
        }

        cutoffBills.value.filter((service) => service !== billTitle);
        bankAccount.value = bankAccount.value - (billToRestore.amounts[0] + 25);
        dailyLog.value.push(billTitle + " service has been restored");
        return billTitle + " service has been restored";
    }

    // These functions don't get exported
    function checkHazards(): void {
        if (randomInt(0, 255) < 191) {
            return;
        }

        const hazard = HAZARDS[randomInt(0, HAZARDS.length)];

        if (checkIfHazardApplies(hazard.requires) === false) {
            return;
        }

		if (hazard.timesUsed === hazard.maxTimesUsed) {
			return
		}

        applyHazard(hazard);

		return
    }

    function checkLuck(): string | void {
        if (randomInt(0, 255) < 128) {
            return;
        }

        const luck = LUCKS[randomInt(0, LUCKS.length)];

        applyLuck(luck);

		return
    }

    function startOfDayLog(): void {
        dailyLog.value.push("Available funds: $" + bankAccount.value);
        dailyLog.value.push("Daily pay rate: $" + payRate.value);
        dailyLog.value.push("Available work points: " + workPoints.value);
        dailyLog.value.push(hasCar.value ? "Has a car" : "Does not have a car");
        dailyLog.value.push("Unpaid bills: " + unpaidBills.value.join(" ,"));
        if (overdueBills.value.length !== 0) {
            dailyLog.value.push("Overdue bills: " + overdueBills.value.join(" ,"));
        }
        if (cutoffBills.value.length !== 0) {
            dailyLog.value.push(
                "These services have been cut off: " + overdueBills.value.join(" ,")
            );
        }
    }

    function setBillValues(): void {
        BILLS.forEach((bill, index) => {
            if (bill.amounts.length > 1) {
                BILLS[index].amounts = [
                    bill.amounts[randomInt(0, bill.amounts.length)],
                ];
            }
        });
    }

    function checkUnpaidBills(): void {
        if (unpaidBills.value.length === 0) {
            return;
        }

        unpaidBills.value.forEach((unpaidBill) => {
            const bill = BILLS.find((bill) => bill.title === unpaidBill);
            const index = BILLS.findIndex((bill) => bill.title === unpaidBill);

            if (bill) {
                if (bill.dueBy <= simulationTurn.value) {
                } else if (bill.dueBy + 3 <= simulationTurn.value) {
                    overdueBills.value.push(bill.title);
                    BILLS[index].amounts[0] = BILLS[index].amounts[0] * 1.1; //bill late fee is 10%
                    dailyLog.value.push(
                        bill.title + " bill is overdue. Adding 10% to amount due."
                    );
                } else {
                    overdueBills.value = overdueBills.value.filter(
                        (item) => item !== unpaidBill
                    );
                    cutoffBills.value.push(unpaidBill);
                    dailyLog.value.push(unpaidBill + " has been cut off.");
                }
            }
        });

        overdueBills.value = [...new Set(overdueBills.value)];
        cutoffBills.value = [...new Set(cutoffBills.value)];
    }

    function checkIfHazardApplies(hazardRequires: string[]): boolean {
        let requiredCount: number = 1;

        const refs: Record<string, boolean> = {
            hasJob: hasJob.value,
            hasCar: hasCar.value,
        };

        hazardRequires.forEach((hazard) => {
            if (!refs[hazard]) {
                requiredCount = requiredCount - 1;
            }
        });

        return requiredCount === hazardRequires.length;
    }

    function applyHazard(hazard: Hazard): void {
        const refs: Record<string, number | boolean> = {
            bankAccount: bankAccount.value,
            workPoints: workPoints.value,
            payRate: payRate.value,
            hasCar: hasCar.value,
            hasJob: hasJob.value,
            hasHome: hasHome.value,
        };

        let descriptions: string[] = hazard.description;

        hazard.effects.forEach((effect) => {
            if (typeof effect.value[0] === "number") {
                const numberValues = effect.value as number[];
                let effectValue = numberValues[randomInt(0, numberValues.length)];
                const current = refs[effect.item];

                if (typeof current === "number") {
                    refs[effect.item] = current - effectValue;
                }

                descriptions.forEach((description) => {
                    const valueAsString = effectValue as unknown as string;
					const toReplace = "%" + effect.item + "%";
                    let modifiedDesciption = description.replace(toReplace, valueAsString);

                    dailyLog.value.push(modifiedDesciption);
                });
            } else {
                refs[effect.item] = effect.value[0];
            }
        });

		hazard.timesUsed = hazard.timesUsed++;

		return
    }

    function applyLuck(luck: Luck): void {
        const refs: Record<string, number | boolean> = {
            bankAccount: bankAccount.value,
            payRate: payRate.value,
        };

        let descriptions: string[] = luck.description;

        luck.effects.forEach((effect) => {
            if (typeof effect.value[0] === "number") {
                const numberValues = effect.value as number[];
                let effectValue = numberValues[randomInt(0, numberValues.length)];
                const current = refs[effect.item];

                if (typeof current === "number") {
                    refs[effect.item] = current - effectValue;
                }

                descriptions.forEach((description) => {
                    const valueAsString = effectValue as unknown as string;
					const toReplace = "%" + effect.item + "%";
                    let modifiedDesciption = description.replace(toReplace, valueAsString);

                    dailyLog.value.push(modifiedDesciption);
                });
            } else {
                refs[effect.item] = effect.value[0];
            }
        });

		return
    }

    function randomInt(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    return {
        simulationTurn,
        bankAccount,
        workPoints,
        payRate,
        hasJob,
        hasCar,
        hasHome,
        unpaidBills,
        overdueBills,
        cutoffBills,
        dailyLog,
        startSimulation,
        startNextDay,
        payBill,
        restoreService,
    };
});

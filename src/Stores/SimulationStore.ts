import { ref, type Ref } from "vue";
import { defineStore } from "pinia";
import billsJson from "../Data/bills.json";
import hazardsJson from "../Data/hazards.json";
import lucksJson from "../Data/lucks.json";
import interventionsJson from "../Data/interventions.json";
import type {
    Bill,
    Hazard,
    Luck,
    Intervention,
    DailyLog
} from "../Types/SimulationTypes";

// let INTERVENTIONS = interventionsJson satisfies Intervention[];

export const useSimulationStore = defineStore("Simulation", () => {
    let BILLS = billsJson satisfies Bill[];
    let HAZARDS = hazardsJson satisfies Hazard[];
    let LUCKS = lucksJson satisfies Luck[];

    const simulationTurn = ref<number>(0);
    const bankAccount = ref<number>(800);

    const workPoints = ref<number>(3);
    const payRate = ref<number>(37.68);
    const hasJob = ref<boolean>(true);
    const hasCar = ref<boolean>(true);
    const hasHome = ref<boolean>(true);

    const unpaidBills = ref<string[]>([]);
    const overdueBills = ref<string[]>([]);
    const cutoffBills = ref<string[]>([]);

    const dailyLog = ref<DailyLog[]>([]);

    function startSimulation(): string {
        BILLS.forEach((bill) => {
            unpaidBills.value.push(bill.title);
        });

        setBillValues();

        startOfDayLog();

        return "Simulation started";
    }

    function startNextDay(): string {
        simulationTurn.value = simulationTurn.value + 1;

        checkUnpaidBills();

        checkHazards();
		checkLuck();

        startOfDayLog();

        bankAccount.value = Math.ceil(bankAccount.value + payRate.value);

        return "Day: " + simulationTurn.value;
    }

    function payBill(billTitle: string): string {
        const bill = BILLS.find((bill) => bill.title === billTitle);

        if (bill === undefined) {
            return "Can't pay an undefined bill.";
        } else if (bankAccount.value > bill.amounts[0]) {
            bankAccount.value = bankAccount.value - bill.amounts[0];
            unpaidBills.value = unpaidBills.value.filter(bill => bill !== billTitle);
            cutoffBills.value = cutoffBills.value.filter(bill => bill !== billTitle);

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
        dailyLog.value.push(
            {
                day: simulationTurn.value,
                description: billTitle + " service has been restored"
            }
        );
        return billTitle + " service has been restored";
    }

    // These functions don't get exported
    function startOfDayLog(): void {
        dailyLog.value.push(
            {
                day: simulationTurn.value,
                description: "Available funds: $" + bankAccount.value
            }
        );
        dailyLog.value.push(
            {
                day: simulationTurn.value,
                description: "Daily pay rate: $" + payRate.value
            }
        );
        dailyLog.value.push(
            {
                day: simulationTurn.value,
                description: "Available work points: " + workPoints.value
            }
        );
        dailyLog.value.push(
            {
                day: simulationTurn.value,
                description: hasCar.value ? "Has a car" : "Does not have a car"
            }
        );
        dailyLog.value.push(
            {
                day: simulationTurn.value,
                description: "Unpaid bills: " + unpaidBills.value.join(", ")
            }
        );
        if (overdueBills.value.length !== 0) {
            dailyLog.value.push(
                {
                    day: simulationTurn.value,
                    description: "Overdue bills: " + overdueBills.value.join(", ")
                }
            );
        }
    }

    function setBillValues(): void {
        BILLS.forEach((bill, index) => {
            if (bill.amounts.length > 1) {
                BILLS[index].amounts = [
                    bill.amounts[randomInt(0, bill.amounts.length - 1)],
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
                if (simulationTurn.value < bill.dueBy) {

                } else if (simulationTurn.value < bill.dueBy + 3) {
                    overdueBills.value.push(bill.title);
                    BILLS[index].amounts[0] = Number((BILLS[index].amounts[0] * 1.1).toFixed(2)); //bill late fee is 10%
                    dailyLog.value.push(
                        {
                            day: simulationTurn.value,
                            description: bill.title + " bill is overdue. Adding 10% to amount due."
                        }
                    );
                } else {
                    overdueBills.value = overdueBills.value.filter(
                        (item) => item !== unpaidBill
                    );
                    cutoffBills.value.push(unpaidBill);
                    dailyLog.value.push(
                        {
                            day: simulationTurn.value,
                            description: unpaidBill + " has been cut off."
                        }
                    );
                }
            }
        });

        overdueBills.value = [...new Set(overdueBills.value)];
        cutoffBills.value = [...new Set(cutoffBills.value)];
    }

    function checkHazards(): void {
        if (randomInt(0, 255) < 191) {
            return;
        }

        const hazard = HAZARDS[randomInt(0, HAZARDS.length - 1)];

        if (checkIfHazardApplies(hazard.requires) === false) {
            return;
        }

		if (hazard.timesUsed === hazard.maxTimesUsed) {
			return
		}

        applyHazard(hazard);

		return
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
        const refs: Record<string, Ref<number> | Ref<boolean>> = {
            bankAccount,
            workPoints,
            payRate,
            hasCar,
            hasJob,
            hasHome,
        };

        let descriptions: string[] = hazard.description;

        hazard.effects.forEach((effect) => {
            if (typeof effect.value[0] === "number") {
                const numberValues = effect.value as number[];
                let effectValue = numberValues[randomInt(0, numberValues.length - 1)];
                const currentRef = refs[effect.item];

                if (typeof currentRef.value === "number") {
                    currentRef.value = currentRef.value - effectValue;
                }

                descriptions.forEach((description) => {
                    const valueAsString = effectValue as unknown as string;
					const toReplace = "%" + effect.item + "%";
                    let modifiedDesciption = description.replace(toReplace, valueAsString);

                    dailyLog.value.push(
                        {
                            day: simulationTurn.value,
                            description: modifiedDesciption
                        }
                    );
                });
            } else {
                const currentRef = refs[effect.item];

                if (typeof currentRef.value === "boolean") {
                    currentRef.value = effect.value[0] as boolean;
                }
            }
        });

		hazard.timesUsed = hazard.timesUsed++;

		return
    }

    function checkLuck(): void {
        if (randomInt(0, 255) < 128) {
            return;
        }

        const luck = LUCKS[randomInt(0, LUCKS.length - 1)];

        applyLuck(luck);

		return
    }

    function applyLuck(luck: Luck): void {
        const refs: Record<string, Ref<number>> = {
            bankAccount,
            payRate,
        };

        let descriptions: string[] = luck.description;

        luck.effects.forEach((effect) => {
			let effectValue = effect.value[randomInt(0, effect.value.length - 1)];

			refs[effect.item].value = refs[effect.item].value + effectValue;

			descriptions.forEach((description) => {
				const valueAsString = effectValue as unknown as string;
				const toReplace = "%" + effect.item + "%";
				let modifiedDesciption = description.replace(toReplace, valueAsString);

				dailyLog.value.push(
                    {
                        day: simulationTurn.value,
                        description: modifiedDesciption
                    }
                );
			});
        });

		return
    }

    function randomInt(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    return {
        BILLS,
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

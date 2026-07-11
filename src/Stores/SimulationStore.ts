import { ref } from "vue";
import { defineStore } from "pinia";
import billsJson from "../Data/bills.json";
import hazardsJson from "../Data/hazards.json";
import lucksJson from "../Data/hazards.json";
import interventionsJson from "../Data/hazards.json";
import type { Bill, Hazard, Luck, Intervention, OverdueBill } from "../Types/Simulation";

let BILLS = billsJson satisfies Bill[];
let HAZARDS = hazardsJson satisfies Hazard[];
let LUCKS = lucksJson satisfies Luck[];
let INTERVENTIONS = interventionsJson satisfies Intervention[];

export const useSimulationStore = defineStore("Simulation", () => {
    const simulationTurn = ref<number>(0);
    const bankAccount = ref<number>(800);

    const workPoints = ref<number>(3);
    const payRate = ref<number>(60);
    const hasCar = ref<boolean>(true);

    const unpaidBills = ref<string[]>([]);
    const overdueBills = ref<OverdueBill[]>([]);

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

        return "Day: " + simulationTurn.value;
    }

    function payBill(billTitle: string): string {
        const bill = BILLS.find((bill) => bill.title === billTitle);

        if (bill === undefined) {
            return "Can't pay an undefined bill.";
        } else if (bankAccount.value > bill.amounts[0]) {
            bankAccount.value = bankAccount.value - bill.amounts[0];
            //remove bill from bills

            return bill.title + " bill has been paid."
        } else {
            return "You don't have enough to pay " + bill.title + " bill."
        }
    }

    function startOfDayLog(): void {
        dailyLog.value.push("Available funds: $" + bankAccount.value);
        dailyLog.value.push("Daily pay rate: $" + payRate.value);
        dailyLog.value.push("Available work points: " + workPoints.value);
        dailyLog.value.push(hasCar.value ? "Has a car" : "Does not have a car");
        dailyLog.value.push("Unpaid bills: " + unpaidBills.value.join(" ,"));
        dailyLog.value.push("Overdue bills: " + overdueBills.value.map((bill) => bill.title).join(" ,"));
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
            return
        }

        unpaidBills.value.forEach(unpaidBill => {
            let bill = BILLS.find((bill) => bill.title === unpaidBill)

            if (bill) {
                if (bill.dueBy <= simulationTurn.value) {
                    return
                } else {
                    overdueBills.value.push({
                        title: bill.title,
                        daysOverdue: simulationTurn.value - bill.dueBy,
                        overdueAmount: bill.amounts[0] * 1.1
                    })
                }
            } else {
                return
            }
        })
    }

    function randomInt(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    return {
        simulationTurn,
        bankAccount,
        workPoints,
        hasCar,
        unpaidBills,
        dailyLog,
        startSimulation,
        startNextDay,
        payBill
    };
});

import {Risk} from "../models/Risk";

export class RiskAPI {
    static fetchAll(): Promise<{ risks: Risk[] }> {
        return new Promise((resolve, reject) => {
            resolve({
                risks: []
            });
        });
    }
}


"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CandidateController = void 0;
const data_source_1 = require("../data-source");
const Candidate_1 = require("../entity/Candidate");
class CandidateController {
    constructor() {
        this.candidateRepository = data_source_1.AppDataSource.getRepository(Candidate_1.Candidate);
    }
    // Get all candidates
    getAllCandidates(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const candidates = yield this.candidateRepository.find({
                    relations: ["applications"]
                });
                return res.json(candidates);
            }
            catch (error) {
                return res.status(500).json({ message: 'Error retrieving candidates', error });
            }
        });
    }
    getCandidateByEmail(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email } = req.params;
                // Find candidate by email
                const candidate = yield this.candidateRepository.findOne({
                    where: { email },
                    relations: ["applications"]
                });
                // If they don't exist, return a 404 error
                if (!candidate) {
                    return res.status(404).json({ message: 'Candidate not found' });
                }
                return res.json(candidate);
            }
            catch (error) {
                return res.status(500).json({ message: 'Error retrieving candidate', error });
            }
        });
    }
}
exports.CandidateController = CandidateController;
//# sourceMappingURL=CandidateController.js.map
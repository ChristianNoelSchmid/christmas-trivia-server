"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cycleGet = exports.shuffle = void 0;
const shuffle = (array) => {
    for (let i = array.length - 1; i >= 0; --i) {
        const randI = Math.floor(Math.random() * i);
        [array[i], array[randI]] = [array[randI], array[i]];
    }
};
exports.shuffle = shuffle;
const cycleGet = (array, index) => {
    let i = index % array.length;
    if (index < 0)
        i += array.length;
    return array[i];
};
exports.cycleGet = cycleGet;
//# sourceMappingURL=array.js.map
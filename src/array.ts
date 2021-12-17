
const shuffle = <T>(array: T[]) => {
    for(let i = array.length - 1; i >= 0; --i) {
        const randI = Math.floor(Math.random() * i);
        [array[i], array[randI]] = [array[randI], array[i]];
    }
}

const cycleGet = <T>(array: T[], index: number): T => {
    let i = index % array.length;
    if(index < 0) i += array.length;

    return array[i];
}

export { shuffle, cycleGet };
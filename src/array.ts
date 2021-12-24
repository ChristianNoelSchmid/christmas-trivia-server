
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


// Taken from https://flexiple.com/javascript-capitalize-first-letter/
const capitalize = (str: string) => {
    const arr = str.split(" ");

    for (var i = 0; i < arr.length; i++) {
        arr[i] = arr[i].charAt(0).toUpperCase() + arr[i].slice(1);
    }

    const str2 = arr.join(" ");

    return str2;
}

export { shuffle, cycleGet, capitalize };
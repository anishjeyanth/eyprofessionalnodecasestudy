const DEFAULT_MINIMUM = 1;
const DEFAULT_MAXIMUM = 1000000;

class RandomGenerator {
    static generate(minimum = DEFAULT_MINIMUM, maximum = DEFAULT_MAXIMUM) {
        let generatedRandom = Math.floor(
            Math.random() * (maximum - minimum) + minimum);
            
        return generatedRandom;
    }
}

export {
    RandomGenerator
};

class Level
{
    constructor(inputCount, outputCount) {
        this.inputs = new Array(inputCount);
        this.output = new Array(outputCount);
        this.biases = new Array(outputCount);
        this.weight = [];
        for (let i = 0; i<inputCount;i++){
            this.weight[i] = new Array(outputCount);
        }
        Level.#randomize(this);
    }

    static #randomize(level)
    {
        for (let i = 0; i<level.inputs.length; i++)
        {
            for(let j = 0; j< level.output.length;j++)
            {
                level.weight[i][j]= Math.random()*2 - 1;
            }
        }
        for (let i = 0; i<level.biases;i++)
        {
            level.biases[i] = Math.random()*2+1;
        }
    }
    static feedForward(givenInput, level)
    {
        for(let i = 0; i<level.inputs.length;i++)
        {
            level.inputs[i] = givenInput[i];
        }
        for(let i = 0; i<level.output.length;i++)
        {
            let sum = 0;
            for (let j = 0; j<level.inputs.length;j++)
            {
                sum += level.inputs[j] * level.weight[j][i];
            }

            if (sum>level.biases[i])
            {
                level.output[i] = 1;
            }
            else
            {
                level.output[i] = 0;
            }
        }
        return level.output;
    }
}
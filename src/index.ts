const modes = ['normal', 'hard'] as const
type Mode = typeof modes[number]

class HitAndBlow {
    private readonly answerSouce = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']
    private answer: string[] = []
    private tryCount = 0
    private mode: Mode = 'normal'

    

    async setting() {
      this.mode = await promptSelect<Mode>('モードを入力して下さい。', modes)
      const answerLength = this.getAnswerLength()
      while (this.answer.length < answerLength) {
        const randNum = Math.floor(Math.random() * this.answerSouce.length)
        const selectedItem = this.answerSouce[randNum]
        if (!this.answer.includes(selectedItem)) {
          this.answer.push(selectedItem)
        }
      }
    }

    async play() {
      const answerLength = this.getAnswerLength()
      const inputArr = (await promptInput(`「、」区切りで${answerLength}つの数字を入力して下さい`)).split(',')
      if (!this.validate(inputArr)) {
        printLine('無効な入力です。')
        await this.play()
        return
      }

      const result = this.check(inputArr)

      if(result.hit !== this.answer.length) {
        printLine(`---\nHit: ${result.hit}\nBlow: ${result.blow}\n---`)
        this.tryCount += 1
        await this.play()
      } else {
        this.tryCount +=1
      }
    }

    private  check(input: string[]) {
      let hitCount = 0
      let blowCount = 0

      input.forEach((val, index) => {
        if (val === this.answer[index]) {
          hitCount += 1
        }else if (this.answer.includes(val)){
          blowCount += 1
        }
      })
        return {
          hit: hitCount,
          blow: blowCount,
        }
      }

    end() {
      printLine(`正解です！\n試行回数: ${this.tryCount}回`)
      process.exit()
    }

    private validate(inputArr: string[]) {
      const isLengthValid = inputArr.length === this.answer.length
      const isAllAnswerSouceOption = inputArr.every((val) => this.answerSouce.includes(val))
      const isAllDifferentValues = inputArr.every((val, i) => inputArr.indexOf(val) === i)
      return isLengthValid && isAllAnswerSouceOption && isAllDifferentValues
    }

    private getAnswerLength() {
      switch(this.mode) {
        case "normal": return 3
        case "hard": return 4
        // case "very hard": return 5
        default: 
          const neverVal: never = this.mode
          throw new Error(`${neverVal}は無効なモードです。`);
      }
      
    }
}


const printLine = (text: string, breakLine: boolean = true) => {
  process.stdout.write(text + (breakLine ? '\n' : ''))
}

const readLine = async () => {
  const input: string = await new Promise((resolve) => 
    process.stdin.once('data', (data) => resolve(data.toString())))
  return input.trim()  
}

const promptInput = async (text: string) => {
  printLine(`\n${text}\n`, false)
  
  return readLine()
}

const promptSelect = async <T extends string>(text: string, values: readonly T[]): Promise<T> => {
  printLine(`\n${text}`)
  values.forEach((value) => {
    printLine(`- ${value}`)
  })
  printLine(`> `, false)

  const input = (await readLine()) as T
  if (values.includes(input)) {
    return input
  } else {
    return promptSelect<T>(text, values)
  }
}

(async() => {
  const hitAndBlow = new HitAndBlow()
  await hitAndBlow.setting()
  await hitAndBlow.play()
  hitAndBlow.end()
})()


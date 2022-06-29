import React, {ReactElement, useState} from 'react';
import './App.css';

type EntryProps = {
    in: string
    out: string
    ans: string
    ansCorrect: boolean
}

type RFProps = {
    fileName: string
}

function Entry(props: EntryProps) {
    return (
        <li>
            {props.in}<br/>
            {props.out}<br/>
            <span className={(props.ansCorrect) ? "text-green-800" : "text-red-800"}>{props.ans}</span><br/><br/>
        </li>
    )
}

function Rf(props: RFProps) {
    return (
        <li>
            Reading {props.fileName}
        </li>
    )
}

function arrts(arr: Array<any>) {
    let str = "["
    str += arr.toString().replaceAll(",", ", ")
    str += "]"
    return str
}

const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

function bubble(arr:Array<any>, comp: (a:number, b:number) => number) {
    for (let i = 0; i < arr.length - 1; i++) {
        for (let j = 0; j < arr.length - i - 1; j++) {
            if (comp(arr[j], arr[j + 1]) > 0) {
                let tmp = arr[j]
                arr[j] = arr[j + 1]
                arr[j + 1] = tmp
            }
        }

    }
    return arr
}

function App() {

    const [list, setList] = useState(new Array<ReactElement>(0))
    let ran = false

    async function run(_sleep: boolean) {
        if (ran) {
            return
        }
        ran = true
        let l: ReactElement[] = []
        for (let i = 1; i <= 10; i++) {
            let inTxt: any = undefined
            await fetch(`/${i}.in`)
                .then(resp => resp.text())
                .then(dat => inTxt = dat)
            let outTxt: any = undefined
            await fetch(`/${i}.out`)
                .then(resp => resp.text())
                .then(dat => outTxt = dat)
            while (inTxt === undefined || outTxt === undefined) ;
            console.log(inTxt)
            console.log(outTxt)
            const inNums: number[] = inTxt.split(" ").map((a: string) => parseInt(a))
            const outNums: number[] = outTxt.split(" ").map((a: string) => parseInt(a))
            const _inNums = bubble([...inNums], (a, b) => (a - b))
            const a = _inNums[0]
            const b = _inNums[1]
            const c = _inNums[_inNums.length - 1] - a - b
            l = [...l]
            if (_sleep)
                l.splice(l.length - 1, 1)
            l.push(<Entry ansCorrect={[a, b, c].every(e => outNums.includes(e))} key={l.length} ans={`Ans: ${arrts([a, b, c])}`} in={`/${i}.in ${arrts(inNums)}`} out={`/${i}.out ${arrts(outNums)}`}/>)
            if (i !== 10 && _sleep)
                l.push(<Rf fileName={`/${i + 1}.in, /${i + 1}.out (I made it sleep for 500ms to make it look cool :(( )`}/>)
            setList(l)
            if (_sleep)
                await sleep(500)
        }
    }

    return (
        <div className={"mt-6 ml-6 mb-6 mr-6 pl-1.5 pt-1 wh-full overflow-auto space new-text-aqua new-box-aqua"}>
            ABCs<br/>
            https://github.com/bob-greg/hw7<br/><br/>
            <button onClick={() => {
                    ran = false
                    run(true)
                }}
                className={"new-button-amber transition new-text-amber ease-in-out delay-50 hover:bg-sky-400 hover:text-white duration:300 pl-1 pr-1"}
            >
                run slowed!
            </button>
            <br/>
            <div className={"pt-3"}></div>
            <button onClick={() => {
                    ran = false
                    run(false)
                }}
                className={"new-button-amber transition new-text-amber ease-in-out delay-50 hover:bg-sky-400 hover:text-white duration:300 pl-1 pr-1"}
            >
                run @ full speed!
            </button>
            <br/>
            <br/>
            <ul className={"list-disc list-inside pl-3 text-sm"}>
                {list}
            </ul>
        </div>
    );
}

export default App;

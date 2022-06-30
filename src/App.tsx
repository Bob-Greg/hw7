import React, {ReactElement, useState} from 'react';
import './App.css';
import {TextBox} from "./text-box";

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
    const [inTxt, setInTxt] = useState("")
    const [outTxt, setOutTxt] = useState("")
    let ran = false

    function getABCs(inTxt: string, outTxt: string) {
        const inNums: number[] = inTxt.split(" ").map((a: string) => parseInt(a))
        const outNums: number[] = outTxt.split(" ").map((a: string) => parseInt(a))
        const _inNums = bubble([...inNums], (a, b) => (a - b))
        const a = _inNums[0]
        const b = _inNums[1]
        const c = _inNums[_inNums.length - 1] - a - b
        return [[a, b, c], outNums, inNums]
    }

    function runManual() {
        const abc1 = getABCs(inTxt, outTxt)
        setList([<Entry in={`Manual ${arrts(abc1[2])}`} out={`Manual ${arrts(abc1[1])}`} ans={`Ans: ${arrts(abc1[0])}`} ansCorrect={abc1[0].every((e: number) => abc1[1].includes(e))}/>])
    }

    async function run(_sleep: boolean) {
        if (ran) {
            return
        }
        ran = true
        let l: ReactElement[] = []
        for (let i = 1; i <= 10; i++) {
            let inTxt: any = undefined
            await fetch(`${i}.in`)
                .then(resp => resp.text())
                .then(dat => inTxt = dat)
            let outTxt: any = undefined
            await fetch(`${i}.out`)
                .then(resp => resp.text())
                .then(dat => outTxt = dat)
            while (inTxt === undefined || outTxt === undefined) ;
            console.log(inTxt)
            console.log(outTxt)
            const abc1 = getABCs(inTxt, outTxt)
            const abc = abc1[0]
            const outNums = abc1[1]
            const inNums = abc1[2]
            l = [...l]
            if (_sleep)
                l.splice(l.length - 1, 1)
            l.push(<Entry ansCorrect={abc.every(e => outNums.includes(e))} key={l.length} ans={`Ans: ${arrts(abc)}`} in={`/${i}.in ${arrts(inNums)}`} out={`/${i}.out ${arrts(outNums)}`}/>)
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
                    if (ran) {
                        return
                    }
                    ran = false
                    run(true)
                }}
                className={"rounded-xl new-button-amber pl-1.5 pr-1.5 transition new-text-amber ease-in-out delay-50 hover:bg-sky-400 hover:text-white duration:300 pl-1 pr-1"}
            >
                run default test cases slowed!
            </button>
            <br/>
            <div className={"pt-3"}></div>
            <button onClick={() => {
                    if (ran) {
                        return
                    }
                    ran = false
                    run(false)
                }}
                className={"rounded-xl new-button-amber pl-1.5 pr-1.5 transition new-text-amber ease-in-out delay-50 hover:bg-sky-400 hover:text-white duration:300 pl-1 pr-1"}
            >
                run default test cases @ full speed!
            </button>
            <br/>
            <br/>
            Custom test cases:
            <div className={"pb-1"}/>
            <TextBox defaultText={"*.in here"} customCss={"rounded-xl new-text-amber pl-1.5 pr-1.5 new-button-amber"} onChange={str => setInTxt(str)}/>
            <div className={"pb-3"}/>
            <TextBox defaultText={"*.out here"} customCss={"rounded-xl new-text-amber pl-1.5 pr-1.5 new-button-amber"} onChange={str => setOutTxt(str)}/>
            <div className={"pb-3"}/>
            <button onClick={() => {
                if (ran) {
                    return
                }
                ran = false
                runManual()
            }}
                    className={"rounded-xl new-button-amber pl-1.5 pr-1.5 transition new-text-amber ease-in-out delay-50 hover:bg-sky-400 hover:text-white duration:300 pl-1 pr-1"}
            >
                run custom test case!
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

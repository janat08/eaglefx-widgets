import { st, PS, MS } from './index.js'

function base (type){
    return st.list.filter(x=>x.base == type)[0]
}

describe('PIP tests all', ()=>{
    beforeEach(() => {
    st.list = [
        { base: "EUR", rates: { "USD": 1.13798, JPY: 1 } },
        { base: "GBP", rates: { "USD": 1.2888, JPY: 123 } },
        { base: "JPY", rates: { USD: 92.51 } },
        { base: "USD", rates: { USD: 1, NZD: .79 } },
        { base: "NZD", rates: { USD: .79}}
    ]
    PS.size = 10000
    PS.conv = "EUR/USD"
    PS.acc = "USD"
})

    it('uses the right exchange rate', () => {
    PS.acc = "EUR"
    expect(PS.curConv).toBe(1.13798);
    PS.acc = "GBP"
    expect(PS.curConv).toBe(1.2888)
});

it("calculates PIP for no conversion", () => {
    expect(PS.pip).toBe(1)
    PS.size = 1000
    expect(PS.pip).toBe(0.1)
    PS.conv = "GBP/USD"
    expect(PS.pip).toBe(0.1)
})

it("works for JPY", () => {
    PS.conv = "USD/JPY"
    PS.acc = "JPY"
    expect(PS.pip).toBe(100)
    PS.size = 1000
})

it("works with conversion", () => {
    PS.conv = "EUR/USD"
    PS.acc = "EUR"
    PS.size = 150000
    expect(PS.pip).toBe(13.1813)
})
// https://www.babypips.com/learn/forex/pips-and-pipettes
it("everything works", () => {
    PS.size = 10000
    PS.acc = "GBP"
    PS.conv = "GBP/JPY"
    expect(PS.pip).toBe(0.813)
    st.list[1].rates.USD = 1.559
    PS.acc = "USD"
    expect(PS.pip.toFixed(4) * 1).toBe(1.2675)
})
// https://www.babypips.com/learn/forex/pips-and-pipettes
it("extra tePS, the laPS example from link", () => {
    PS.size = 10000
    PS.acc = "USD"
    PS.conv = "USD/CAD"
    st.list[3].rates.CAD = 1.02
    expect(PS.pip).toBe(0.9804)
})

it('tePS', ()=>{
    PS.acc = 'USD'
    PS.conv = "USD/EUR"
    PS.size = 100000
    base('USD').rates.EUR = 1.4
    expect(PS.pip).toBe(7.1429)
})

it.skip("tePS based on the example calculator", ()=>{
    PS.size = 10000
    // PS.acc = "USD"
    PS.conv = "EUR/USD"
    st.list[0].rates.USD = 1.1171
    // expect(PS.pip).toBe(0.9804)
    st.list[0].rates.GBP = 1.2981
    PS.acc = "GBP"
    expect(PS.pip.toFixed(5) * 1).toBe(0.77)
})

})


describe('margin calculator', ()=>{
    beforeEach(() => {
    st.list = [
        { base: "EUR", rates: { "USD": 1.13798, JPY: 1 } },
        { base: "GBP", rates: { "USD": 1.2888, JPY: 123 } },
        { base: "JPY", rates: { USD: 92.51 } },
        { base: "USD", rates: { USD: 1, NZD: .79 } },
        { base: "NZD", rates: { USD: .79}}
    ]
    PS.size = 10000
    PS.conv = "EUR/USD"
    PS.acc = "USD"
    it('base case', ()=>{
        
    })
})
})
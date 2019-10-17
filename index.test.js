import { st } from './index.js'

beforeEach(() => {
    st.list = [
        { base: "EUR", rates: { "USD": 1.13798, JPY: 1 } },
        { base: "GBP", rates: { "USD": 1.2888, JPY: 123 } },
        { base: "JPY", rates: { USD: 92.51 } },
        { base: "USD", rates: { USD: 1 } }
    ]
    st.size = 10000
    st.conv = "EUR/USD"
    st.acc = "USD"
})

it('uses the right exchange rate', () => {
    st.acc = "EUR"
    expect(st.curConv).toBe(1.13798);
    st.acc = "GBP"
    expect(st.curConv).toBe(1.2888)
});

it("calculates PIP for no conversion", () => {
    expect(st.pip).toBe(1)
    st.size = 1000
    expect(st.pip).toBe(0.1)
    st.conv = "GBP/USD"
    expect(st.pip).toBe(0.1)
})

it("works for JPY", () => {
    st.conv = "USD/JPY"
    st.acc = "JPY"
    expect(st.pip).toBe(100)
    st.size = 1000
})

it("works with conversion", () => {
    st.conv = "EUR/USD"
    st.acc = "EUR"
    st.size = 150000
    expect(st.pip).toBe(13.1813)
})
// https://www.babypips.com/learn/forex/pips-and-pipettes
it("everything works", () => {
    st.size = 10000
    st.acc = "GBP"
    st.conv = "GBP/JPY"
    expect(st.pip).toBe(0.813)
    st.list[1].rates.USD = 1.559
    st.acc = "USD"
    expect(st.pip.toFixed(4) * 1).toBe(1.2675)
})
// https://www.babypips.com/learn/forex/pips-and-pipettes
it("extra test, the last example from link", () => {
    st.size = 10000
    st.acc = "USD"
    st.conv = "USD/CAD"
    st.list[3].rates.CAD = 1.02
    expect(st.pip).toBe(0.9804)
    st.list[1].rates.NZD = .79
    st.acc = "NZD"
    expect(st.pip.toFixed(4) * 1).toBe(1.2405)
})
import { st } from './index.js'

beforeEach(()=>{
    st.list = [
        {base: "EUR", rates: {"USD": 1.13798}},
        {base: "GBP", rates: {"USD": 1.2888}},
        {base: "JPY", rates: {JPY: 1}},
        {base: "USD", rates: {USD: 1}}
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

it("calculates PIP for no conversion", ()=>{
    expect(st.pip).toBe(1)
    st.size = 1000
    expect(st.pip).toBe(0.1)
    st.conv = "GBP/USD"
    expect(st.pip).toBe(0.1)
})

it("works for JPY", ()=>{
    st.conv = "USD/JPY"
    st.acc = "JPY"
    expect(st.pip).toBe(100)
    st.size = 1000

})
import m from "mithril";
import 'bulma'

const a = ``
const currenciesList = ["USD", "EUR", "AUD", "CAD"]
const conversionsList = currenciesList.reduce((a, x)=>{
    for (let y of currenciesList){
        if (y != x){
            a.push(x+"/"+y)
        }
    }
    return a
}, [])

function field ({label, placeholder, text, target}) {
    const control = text? st[target]: 
    m("div.control"
    , [ m(`input.input[placeholder=${placeholder}]`, 
        { oninput: function (e) {st[target] = e.target.value;}
        , value: st[target] })
    ])
    return (
        m("div.field", [
            m("label.label", label)
            , control
        ])
    )
}

function dropdown ({label, opts, target}){
    return (
        m("div.field", [
            m("label.label", label),
            m("div.control", [
                m(`select.select`,
                { oninput: function (e) {st[target] = e.target.value; console.log(e.target.value)}}
                , opts.map(x=>{
                        return m('option', x)
                    } 
                ))
            ]),
        ])
    )
}

var st = {
    list: [],
    account: "USD",
    conv: "USD/EUR",
    get tp(){
        return this.conv.split('/')[0]
    },
    get bt(){
        return this.conv.split('/')[1]
    },
    size: 10000,
    pip: 1,
    get curConv(){
        const {list, account, conv, bt, tp} = this
        if (!list.length){
            return "loading"
        }
        const res = list.filter(x=>x.base == account)[0].rates[bt]
        return res
    },
    loadList: function() {
        const type="USD"
        const base = "https://api.exchangeratesapi.io/latest"
        const query = `?base=${type}`
        const all = base+query
        const several = currenciesList.map(x=>{
            const base = "https://api.exchangeratesapi.io/latest"
            const query = `?base=${x}`
            const all = base+query
            return m.request({
                method: "GET",
                url: all,
                withCredentials: false,
                background: true,
            })
        })
        Promise.all(several).then(x=>{
            st.list = x
            m.redraw()
        })
    },
    save: function() {
        return m.request({
            method: "PUT",
            url: "https://rem-rest-api.herokuapp.com/api/users/" + st.current.id,
            body: st.current,
            withCredentials: false,
        })
    }
}

window.a = st

const Pip = {
    oninit: st.loadList,
    view: function () {

        return m("div", 
        [ dropdown({label: "Account Currency:", target: "account", opts: currenciesList})
        , dropdown({label: "Currency Pair:", target: "conv", opts: conversionsList})
        , field({label: "Trade Size (In units):", target: "size"})
        , field({label: "Current Conversion Price: (USD/USD):", text: 1, target: "curConv"})
        , field({label: "PIP:", text: 1, target: "pip"})
        , m('div', JSON.stringify(st.list)+"sdf")
        ])
    } 
}

m.mount(document.body, Pip);

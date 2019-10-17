import m from "mithril";
// import 'bulma'
import horsey from "horsey"
import typeahead from './autocomplete/index'

horsey(document.querySelector('.horsey'), {
    source: [{ list: ['banana', 'apple', 'orange'] }]
});

const a = ``
const currenciesList = ["USD", "EUR", "AUD", "CAD"]
const conversionsList = currenciesList.reduce((a, x) => {
    for (let y of currenciesList) {
        if (y != x) {
            a.push(x + "/" + y)
        }
    }
    return a
}, [])

function field({ label, placeholder, text, target }) {
    const control = text ? st[target] :
        m("div.control"
            , [m(`input.input[placeholder=${placeholder}]`,
                {
                    oninput: function (e) { st[target] = e.target.value; }
                    , value: st[target]
                })
            ])
    return (
        m("div.field", [
            m("label.label", label)
            , control
        ])
    )
}

if (null) {
    // function dropdown ({label, opts, target}){
    //     return (
    //         m("div.field", [
    //             m("label.label", label),
    //             m("div.control", [
    //                 m(`select.select`,
    //                 { oninput: function (e) {st[target] = e.target.value; console.log(e.target.value)}}
    //                 , opts.map(x=>{
    //                         return m('option', x)
    //                     } 
    //                 ))
    //             ]),
    //         ])
    //     )
    // }
}
function dropdown({ label, opts, target }) {
    return (
        m('div', [
            m('div.dropdown.is-active', [
                m('div.dropdown-trigger', [
                    m('button.button[aria-haspopup=true][aria-controls=dropdown-menu]', [
                        m('span', "label")
                        , m('span.icon.is-small', [
                            m('i.fas.fa-angle-down[aria-hidden=true]')
                        ])
                    ])
                ])
                , m('div.dropdown-menu[role=menu]', [
                    m('div.dropdown-content', [
                        m('a.dropdown-item.is-active[href=#]', "active item")
                    ])
                ])
            ])
            , m("div.field", [
                m("label.label", label),
                m("div.control", [
                    m(`select.select`,
                        { oninput: function (e) { st[target] = e.target.value; console.log(e.target.value) } }
                        , opts.map(x => {
                            return m('option', x)
                        }
                        ))
                ]),
            ])
        ])
    )
}


var st = {
    list: [],
    acc: "USD",
    conv: "USD/EUR",
    get tp() {
        return this.conv.split('/')[0]
    },
    get bt() {
        return this.conv.split('/')[1]
    },
    size: 10000,
    get pip() {
        const { size, curConv, bt, tp, acc, list } = this
        let pip = 0.0001
        let isBT = bt == acc,
            isTP = tp == acc,
            res = 1
        if (isBT) {
            res = size * pip
        } else if (isTP) {
            res = size * pip / st.curConv
        } else {
            const set = list.filter(x => x.base == tp)[0].rates[bt]
            const direct = list.filter(x => x.base == tp)[0].rates[acc]
            res = (size * pip / set) * direct
        }

        if (bt == "JPY") {
            res = res * 100
        }
        res = Math.round(res * 10000) / 10000
        return res
    },
    get curConv() {
        const { list, acc, conv, bt, tp } = this
        if (!list.length) {
            return "loading"
        }
        const res = list.filter(x => x.base == acc)[0].rates[bt]
        return res
    },
    loadList: function () {
        m.request({
            url: "https://api.exchangeratesapi.io/latest?symbols=USD,GBP"
        }).then(console.log)

        const type = "USD"
        const base = "https://api.exchangeratesapi.io/latest"
        const query = `?base=${type}`
        const all = base + query
        const several = currenciesList.map(x => {
            const base = "https://api.exchangeratesapi.io/latest"
            let query = `?base=${x}`
            query + "&symbols=" + currenciesList.join(',')
            const all = base + query
            return m.request({
                method: "GET",
                url: all,
                withCredentials: false,
                background: true,
            })
        })
        Promise.all(several).then(x => {
            console.log(1, x)
            st.list = x
            m.redraw()
        })
    },
    save: function () {
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
            [dropdown({ label: "Account Currency:", target: "acc", opts: currenciesList })
                , dropdown({ label: "Currency Pair:", target: "conv", opts: conversionsList })
                , field({ label: "Trade Size (In units):", target: "size" })
                , field({ label: "Current Conversion Price: (USD/USD):", text: 1, target: "curConv" })
                , field({ label: "PIP:", text: 1, target: "pip" })
                , m('div', JSON.stringify(st.list) + "sdf")
            ])
    }
}

console.log(typeahead)
m.mount(document.body, Pip);



export { st }
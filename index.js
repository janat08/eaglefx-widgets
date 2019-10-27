import m from "mithril";
import curToFlag from './curToFlag'

window.ab = curToFlag

const a = ``
const lg = console.log
const currenciesList = ["USD", "EUR", "AUD", "CAD", "GBP", "JPY"]
const conversionsList = currenciesList.reduce((a, x) => {
    for (let y of currenciesList) {
        if (y != x) {
            a.push(x + "/" + y)
        }
    }
    return a
}, [])

// https://cdn.countryflags.com/download/united-states-of-america/flag-png-round-icon-32.png
function field({
    label,
    placeholder,
    text,
    target,
    obj
}) {
    const control = m('.field-body', [
        m('.field', [
            m("div.control", {
                style: "text-align: center;"
            }, text ? m('span', obj[target]) : [m(`input.input[placeholder=${placeholder}]`, {
                oninput: function(e) {
                    obj[target] = e.target.value;
                },
                value: obj[target],
                style: "text-align: center;",
                type: 'number'
            })])
        ])
    ])
    return (
        m("div.field.is-horizontal", [
            m("div.field-label", [
                m('label.label', label)
            ]), control
        ])
    )
}

function flaggedSpan(x) {
    const top = curToFlag[tp(x)].toLowerCase()
    const res = [
        m('span.icon', [
            m('figure.image.is-16x16', [
                m(`img.is-rounded[src=https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.4.3/flags/1x1/${top}.svg]`)
            ])
        ]), m('span', x)
    ]
    const pair = x.length > 3
    if (pair) {
        const bot = curToFlag[bt(x)].toLowerCase()
        res.push(
            m('span.icon', [
                m('figure.image.is-16x16', [
                    m(`img.is-rounded[src=https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.4.3/flags/1x1/${bot}.svg]`)
                ])
            ]))
    }
    return m('span', {
        style: 'display:inherit'
    }, res)
}

function dropdown() {
    return {
        oninit: function({
            attrs: {
                label,
                opts,
                target,
                obj
            }
        }) {
            this.obj = obj
            this.label = label
            this.opts = opts
            this.target = target
            this.activated = false
            this.value = obj[target]
            this.veryFirst = true
            this.inIn = () => {
                if (!this.input) return
                this.input.focus()
                this.input.select()
            }
            this.activate = (close) => {
                lg('activate')
                this.activated = !this.activated
                this.value = obj[target]
                if (!this.activated) {
                    //e.target.value = e
                } else {
                    this.inIn()
                }
                this.opts = opts
            }
            this.filter = (x) => {
                this.value = x.target.value
                this.opts = opts.filter(x => x.toLowerCase().includes(this.value.toLowerCase()))
            }
            this.blurred = () => {
                if (this.activated) {
                    this.activate()
                }
            }
            this.select = (x, i) => {
                lg('selec')
                obj[target] = x
                this.value = x
                this.blurred()
                //this.activate()
            }
            this.enter = x => {
                let k = x.key
                if (k == "Enter" || k == "Tab") {
                    lg("enter")
                    this.select(this.opts[0])
                    return false
                }
            }
        },
        view: function({
            state: {
                label,
                opts,
                target,
                activated,
                obj
            }
        }) {
            return (
                m('div.field.is-horizontal', [
                    // m('i', {src=""})
                    // , m('img[src=https://cdn.countryflags.com/download/united-states-of-america/flag-png-round-icon-32.png')
                    , m('div.field-label', [
                        m('label.label', label)
                    ]), m('div.field-body', [
                        m('div.control', {
                            style: {
                                width: '100%'
                            }
                        }, [, m('div', {
                            class: `dropdown ${activated ? 'is-active' : "ab"}`,
                            style: {
                                width: '100%'
                            },

                        }, [
                            m('div.dropdown-trigger', {
                                style: {
                                    width: '100%'
                                }
                            }, [
                                m('button.button[aria-haspopup=true][aria-controls=dropdown-menu]', {
                                    onclick: this.activate,
                                    style: {
                                        width: '100%'
                                    }
                                }, [activated ?
                                    m('input', {
                                        onblur: this.blurred,
                                        oninput: this.filter,
                                        onkeydown: this.enter,
                                        value: this.value,
                                        size: 8,
                                        style: 'border:none;outline:none;width=10px',
                                        oncreate: vnode => {
                                            this.input = vnode.dom;
                                            lg(this);
                                            this.inIn()
                                        }
                                    }) : flaggedSpan(obj[target])

                                ])
                            ]), m('div.dropdown-menu[role=menu]', {
                                style: 'width: 100%'
                            }, [
                                m('div.dropdown-content', {
                                        style: 'width: 100%; height: 300px; overflow-y:auto'
                                    },
                                    this.opts.map((x, i) => {
                                        return m('a.dropdown-item[href=#]', {
                                            onclick: () => this.select(x, i)
                                        }, flaggedSpan(x))
                                    })
                                )
                            ])
                        ])])
                    ])
                ])
            )
        }
    }
}

function getPair(y, x) {
    return x.split('/')[y * 1]
}

function tp(x) {
    return getPair(false, x)
}

function bt(x) {
    return getPair(true, x)
}

var st = {
    list: [],
    loadList: function() {
        if (st.list.length){
            return null
        }
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
            st.list = x
            m.redraw()
        })
    },
}



window.a = st

function margin(){
    
}

function PIP() {
    const LS =   {
        list: [],
    acc: "USD",
    conv: "USD/EUR",
    get list(){
      return st.list  
    },
    get tp() {
        return tp(this.conv)
    },
    get bt() {
        return bt(this.conv)
    },
    size: 10000,
    get curConv() {
        const { list, acc, conv, bt, tp } = this
        if (!list.length) {
            return "loading"
        }

        const res = list.filter(x => x.base == acc)[0].rates[bt]
        return res
    },
    get pip() {
        const {
            size,
            curConv,
            bt,
            tp,
            acc,
            list
        } = this
        if (!list.length) {
            return "loading"
        }
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
        // res = Math.round(res * 10000) / 10000
        return res.toFixed(4) * 1
    }
}

return {
    oninit: st.loadList,
    view: function() {
        return m("div.brand-background",
            [m('div', [m(dropdown, {
                    label: "Account Currency:",
                    target: "acc",
                    opts: currenciesList,
                    obj: LS
                }), m(dropdown, {
                    label: "Currency Pair:",
                    target: "conv",
                    opts: conversionsList,
                    obj: LS
                }), field({
                    label: "Contract size:",
                    target: "size",
                    obj: LS
                }), field({
                    label: `Current Conversion Price: (${st.acc + '/' + st.bt}):`,
                    text: true,
                    target: "curConv",
                    obj: LS
                }), field({
                    label: "PIP value:",
                    text: true,
                    target: "pip",
                    obj: LS
                }), m('p', [
                    m('span', "Made by:"), m('img', {
                        style: 'filter: contrast(0)',
                        src: 'https://www.eaglefx.com/wp-content/uploads/2019/07/logo_eagle2.png'
                    })
                ])]),
                m('div', [
//                    m(dropdown, {
//                    label: "Account Currency:",
//                    target: "acc",
//                    opts: currenciesList
//                    })
                ])

            ])
    }
}
}
// m.mount(document.querySelector('.root'), Pip);
m.mount(document.body, PIP);

export {
    st
}
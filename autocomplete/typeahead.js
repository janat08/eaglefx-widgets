/***********************************
 *
 * Typeahead
 *
 * ATTRS:
 *
 *		collection <Array: required>: the array we'll be searching/filtering
 *		onchange <Function: required>: function to execute on the selected object
 *		
 *	  mapFunc	<Function: optional>: function for mapping the collection into Typeahead-ready format
 *		objectAttr <String: optional>:  attribute name for searching, defaults to "name"
 *		placeholder <String: optional>: input field placeholder text
 *		maxResults <Int: optional>: maximum number of visible results, defaults to the entire filtered list
 *
 * USAGE:
 * 	
 *		m(Typeahead, {
 *			collection: myArray,
 *			onchange: selectItemFunc,
 *			mapFunc: mapComplexObjectIntoSimpleObjectFunc,
 *			objectAttr: filterOnThisAttribute,
 *			placeholder: textInputPlaceholderText,
 *			maxResults: showNoMoreThanThisNumber
 *		})
 *
 * FEATURES:
 *
 *		• Instantly searches and returns relevant objects sorted (case-insensitively) by:
 *			1. exact match
 *			2. begins with searchText
 *			3. contains searchText, sorted alphabetically
 *
 *		• Traverse results using mouse or up/down arrow keys
 *		• Make a selection by clicking or typing enter/return
 *		• Clear search and remove focus by typing esc
 *
 ***********************************/
import m from 'mithril'
;(function(window, m){
    const flatCollection = attrs => 
      attrs.mapFunc
        ? attrs.collection.map(attrs.mapFunc)
        : attrs.collection
  
    const searchResults = (searchText, attrs) => {
      if (!searchText) return []
  
      const objectAttr = attrs.objectAttr || 'name'
      const lowerCaseSearch = searchText.toLowerCase()
  
      const allResults = flatCollection(attrs).filter(object => {
        if (!object[objectAttr]) return false
        return object[objectAttr].toLowerCase().indexOf(lowerCaseSearch) > -1
      })
      .sort((a, b) => {
        var aVal = a[objectAttr].toLowerCase(), bVal = b[objectAttr].toLowerCase()
  
        if (aVal === lowerCaseSearch) return -1
        if (bVal === lowerCaseSearch) return 1
  
        if (aVal.indexOf(lowerCaseSearch) < bVal.indexOf(lowerCaseSearch)) return -1
        if (aVal.indexOf(lowerCaseSearch) > bVal.indexOf(lowerCaseSearch)) return 1
  
        if (aVal < bVal) return -1
        if (aVal > bVal) return 1
  
        return 0
      })
  
      return allResults.slice(0, attrs.maxResults || allResults.length)
    }  
  
    function cancelSearch(instance, vnode) {
      instance.searchText = ''
      vnode.dom.querySelector('input').blur()
    }
  
    function selectResult(vnode, selection, instance) {
      vnode.attrs.onchange(selection)
      cancelSearch(instance, vnode)
    }
  
    function handleKeyDown(instance, vnode, e) {
      var results = searchResults(instance.searchText, vnode.attrs)
  
      switch (e.which) {
        case 40:
          e.preventDefault()
          instance.selectedIndex++
          if (instance.selectedIndex === results.length) instance.selectedIndex = 0
          break
  
        case 38:
          e.preventDefault()
          instance.selectedIndex--
          if (instance.selectedIndex === -1) instance.selectedIndex = results.length - 1
          break
  
        case 13:
          if (instance.selectedIndex > -1) {
            selectResult(vnode, results[instance.selectedIndex], instance)
          }
          break
  
        case 27:
          cancelSearch(instance, vnode)
      }
    }
  
    const Typeahead = vnode => {
      const attrs = vnode.attrs
  
      const instance = {
        selectedIndex: -1,
        searchText: ''
      }
  
      return {
        view: ({attrs}) => m('.type-ahead'
          , m('input[type=text]'
            , {
              disabled: !attrs.collection.length,
              placeholder: attrs.placeholder || 'Search',
              value: instance.searchText,
              oninput: m.withAttr('value', (v) => {
                instance.selectedIndex = -1
                instance.searchText = v
              }),
              onkeydown: handleKeyDown.bind(null, instance, vnode)
            }
          )
          , m('.results'
            , searchResults(instance.searchText, attrs).map((result, idx) => m('.result'
              , {
                class: instance.selectedIndex === idx ? 'selected' : '',
                onmouseenter: () => { instance.selectedIndex = idx },
                onclick: selectResult.bind(null, vnode, result, instance)
              }
              , result[attrs.objectAttr || 'name']
            ))
          )
        )
      }
    }
    window.Typeahead = Typeahead
  })(window, m);
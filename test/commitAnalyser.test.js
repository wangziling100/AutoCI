const analyser = require('../lib/commitAnalyser')

test('test analyse method', ()=>{
    const commit1 = 'init: abc@@test'
    const commit2 = 'init:abc@@test'
    const commit3 = 'init: abc @@ test'
    const commit4 = 'init : abc @ @ test'
    const commit5 = 'init : abc @@ test'
    const commit6 = 'init: abc def @@ test'
    const commit7 = 'init: abc@def@@test'
    expect(analyser.analyse(commit1)).toEqual(['init', 'abc'])
    expect(analyser.analyse(commit2)).toEqual(['init', 'abc'])
    expect(analyser.analyse(commit3)).toEqual(['init', 'abc'])
    expect(analyser.analyse(commit4)).toEqual(['init', 'global'])
    expect(analyser.analyse(commit5)).toEqual(['init', 'abc'])
    expect(analyser.analyse(commit6)).toEqual(['init', 'abcdef'])
    expect(analyser.analyse(commit7)).toEqual(['init', 'abc@def'])

})
const fs = require('fs')
const {
    getInfo,
    searchFile,
    locateConfig,
} = require('../lib/io')

test('test getInfo', ()=>{
    expect(getInfo()).not.toBeUndefined()
    expect(getInfo().branch).not.toBeUndefined()
    expect(getInfo().commit).not.toBeUndefined()
    expect(getInfo().email).not.toBeUndefined()
    expect(getInfo().name).not.toBeUndefined()
})

test('test searchFile', () => {
    expect(searchFile('.', 'test')).toBe('test')
    expect(searchFile('.', 'abc')).toBe(null)
    expect(searchFile('.', 'codecov.yml')).toBe('.github/workflows/codecov.yml')
    expect(searchFile('.', 'codecov.yml', ['.git', '.github'])).toBe(null)
})

test('test locate config', () => {
    const result1 = JSON.parse(
        fs.readFileSync(
            './test/coverage/coverage-final.json'))
    expect(
        locateConfig('global', 
        './test/coverage/coverage-final.json', ''))
    .toEqual(['.', result1])
    expect(locateConfig('coverage', 'coverage-final.json', 'test'))
    .toEqual(['test/coverage', result1])
    expect(locateConfig('coverage', 'coverage-final.json', ''))
    .toEqual(['test/coverage', result1])
    expect(locateConfig('.', 'coverage-final.json', ''))
    .toBe(null)
    expect(locateConfig('coverage', 'coverage-final', ''))
    .toBe(null)
    expect(locateConfig('coverage', 'coverage-final.json', 'abc'))
    .toBe(null)
    expect(locateConfig('coverage', 'coverage-final', 'test'))
    .toBe(null)
})
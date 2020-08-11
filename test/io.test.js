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
            '.github/autoCI.config.json'))
    expect(
        locateConfig('global', 
        '.github/autoCI.config.json', ''))
    .toEqual(['.', result1])
    expect(locateConfig('.github', 'autoCI.config.json', ''))
    .toEqual(['.github', result1])
    expect(locateConfig('.', 'autoCI.config.json', ''))
    .toBe(null)
    expect(locateConfig('.github', 'autoCI.config', ''))
    .toBe(null)
    expect(locateConfig('.github', 'autoCI.config.json', 'abc'))
    .toBe(null)
    expect(locateConfig('.github', 'config.json', 'test'))
    .toBe(null)
})
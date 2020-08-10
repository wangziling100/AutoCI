const {getInfo} = require('../lib/io')

test('test getInfo', ()=>{
    expect(getInfo()).not.toBeUndefined()
    expect(getInfo().branch).not.toBeUndefined()
    expect(getInfo().commit).not.toBeUndefined()
    expect(getInfo().email).not.toBeUndefined()
    expect(getInfo().name).not.toBeUndefined()
})

import { removeFirstWordOfSen } from '@/utils/index.js'
describe('Utils:index', () => {
  it('removeFirstWordOfSen', () => {
    expect(removeFirstWordOfSen('pham lam')).toBe('lam')
  })
})


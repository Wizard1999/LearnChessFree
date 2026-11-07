import { afterEach, describe, expect, it } from 'vitest'
import { getLinkedHover, linkedHoverHandlers, setLinkedHover } from './linkedHover'

afterEach(() => setLinkedHover(null))

describe('linked hover', () => {
  it('holds the skill under the pointer and clears it', () => {
    setLinkedHover('TAC.FORK')
    expect(getLinkedHover()).toBe('TAC.FORK')
    setLinkedHover(null)
    expect(getLinkedHover()).toBeNull()
  })
  it('handlers set on enter and focus, clear on leave and blur', () => {
    const h = linkedHoverHandlers('FND.CHECK')
    h.onMouseEnter(); expect(getLinkedHover()).toBe('FND.CHECK')
    h.onMouseLeave(); expect(getLinkedHover()).toBeNull()
    h.onFocus(); expect(getLinkedHover()).toBe('FND.CHECK')
    h.onBlur(); expect(getLinkedHover()).toBeNull()
  })
})

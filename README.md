# Dvorak Viz

A visual exploration of the efficiency difference between common and obscure keyboard layouts.

---

## Notes

### TODO
- originally position keyboards off screen and input text in center -- this will be less confusing to newcomers
- paths on keyboard                                 (abstract)
- percent of keystrokes that alternated hands       (bar)
- modify distance calculation:
    - After typing a key, the finger should return back to the home positions
    after a letter or two passes without them being called.
    - This can wait
- **fix distance calculation**:
    - I noticed that repeatedly pressing a key that isn't in an initial position is still adding a distance when it shouldn't. e.x. `pppppp`
    - **(urgent)**
- text presets
- add tooltip legend to the passage

### Ideas for ending

*At the end of the day, I could have saved at least XX minutes of my life if I had just written this using a Dvorak keyboard... and you could have saved \<insert the total amount of time delta for all characters that were ever entered into the input area>*

*RIP Dvorak.*

### Proportion of Dvorak users
- https://www.csmonitor.com/1995/0817/17092.html
   - Less than 1% of the population uses Dvorak.
- https://thenewstack.io/the-geeks-who-use-alternate-keyboard-layouts/
   - 100,000 use Colemak
- https://www.reddit.com/r/dvorak/comments/b7e62v/estimated_number_of_dvorak_users/
- https://www.bbc.com/worklife/article/20180521-why-we-cant-give-up-this-odd-way-of-typing
   - Less than 0.1% of a keyboard manufacturer Matias (known for Dvorak keyboards!) are even Dvorak

```
P(Dvorak | DV) = 1     # If you own DV keyboard you almost certainly use Dvorak
P(DV) < 0.001          # The proportion of Matias keyboard sales that are DV.
                       #   Used as a proxy for total Latin keyboard sales... but
                       #   unjustifiably so.  Matias is *known* to sell DV, so
                       #   their number is likely inflated!
P(DV | Dvorak) =? 0.1  # What proportion of Dvorak users go as far as to buy a
                       #   DV keyboard?  Unknown but estimated by a redditor ;)

P(A | B) = P(B | A)P(A) / P(B)
=> P(B) = P(B | A)P(A) / P(A | B)
=> P(Dvorak) = P(Dvorak | DV) P(DV) / P(DV | Dvorak)
=> P(Dvorak) = 1 * 0.001 / 0.1 = 0.01 = 1%.
```

## Sources
The Dvorak Keyboard, QWERTY, and Typewriters
- https://www.mit.edu/~jcb/Dvorak/
- https://www.discovermagazine.com/technology/the-curse-of-qwerty
- https://www.dvorak-keyboard.com/
- https://en.wikipedia.org/wiki/Dvorak_keyboard_layout
- https://en.m.wikipedia.org/wiki/Dvorak_keyboard_layout#Overview
- https://en.wikipedia.org/wiki/QWERTY
- https://en.wikipedia.org/wiki/Typewriter

Keycap Dimensions
- https://support.wasdkeyboards.com/hc/en-us/articles/115009701328-Keycap-Size-Compatibility
- https://hobgear.com/understand-keyboard-sizes/
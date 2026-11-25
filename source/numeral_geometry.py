"""Editorially normalized numeral pair, based on chart + lecture + floor evidence.
Coordinates in the original 100-unit design grid (SVG y increases down).
The exact proportions are editorial, not an official vector original.
"""
CENTER=(50,51)
THREE=(((20,21),(80,51),(20,81)),((80,21),(20,51),(80,81)))

def rotate_clockwise(strokes):
    cx,cy=CENTER
    return tuple(tuple((cx-(y-cy),cy+(x-cx)) for x,y in path) for path in strokes)

FOUR=rotate_clockwise(THREE)

def svg_path(strokes):
    return ' '.join('M'+' L'.join(f'{x} {y}' for x,y in path) for path in strokes)

NUMERAL_PATHS={'3':svg_path(THREE),'4':svg_path(FOUR)}

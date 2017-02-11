# -*- coding: utf-8 -*-

import PIL as PIL
import numpy as np
from scipy import signal as s
import matplotlib.pyplot as plt

N = 64
n = 8
w = s.windows.gaussian(N,n);
w = np.array(w, ndmin=2)
ww = np.dot(w.T, w)

plt.imshow(ww, interpolation='nearest', cmap='gray')

img = PIL.Image.new('RGBA', (N,N))

f = 0.2;

wwa = []
for row in ww:
    for val in row:
        a = int(255*val*f)
        #i = int(255*(f*val + (1-f)))
        i = int(255*f*val)
        p = 255-i
        wwa.append((p,p,p, a))

img.putdata(wwa)
img.save("particle.alpha.png")












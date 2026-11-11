# Optional reference authoring tool: Python, Pillow, NumPy, SciPy, Poppler.
import argparse,subprocess
parser=argparse.ArgumentParser();parser.add_argument('pdf');parser.add_argument('--output',default='public');args=parser.parse_args()
from pathlib import Path
work=Path('/tmp/fr-optical-digitization');work.mkdir(exist_ok=True)
subprocess.run(['pdftoppm','-f','6','-l','6','-scale-to','2400','-png',args.pdf,str(work/'plan')],check=True)
from PIL import Image
import numpy as np
from scipy import ndimage as nd
im=np.array(Image.open(str(work/'plan-6.png')).convert('RGB'));gray=im.mean(axis=2)
mask=~nd.binary_closing(gray<215,structure=np.ones((3,3)));labels,n=nd.label(mask);items=[]
for i,sl in enumerate(nd.find_objects(labels),1):
 if sl is None:continue
 y,x=sl;w=x.stop-x.start;h=y.stop-y.start
 if w>90 and h>35 and w<210 and h<150 and x.start>1800:
  cy,cx=nd.center_of_mass(mask,labels,i);items.append((i,x.start,y.start,w,h,cx,cy))

import json,math
specs=[(221,54,41),(222,55,37),(223,53,33),(224,52,36),(225,51,32),(226,50,32),(227,48,32),(231,46,32),(232,49,33),(233,50,33),(234,52,35),(235,51,38)]
specs2=[(341,46,26),(342,45,28),(343,48,27),(344,49,26),(345,47,31),(346,51,28),(347,52,27),(351,50,26),(352,50,28),(353,51,29),(354,55,30),(355,52,28),(356,52,28),(357,50,29),(358,51,29)]
records=[]
for group,spec in [(sorted([p for p in items if 1800<p[1]<2000],key=lambda p:p[-1]),specs),(sorted([p for p in items if p[1]>2200],key=lambda p:p[-1]),specs2)]:
 assert len(group)==len(spec),(len(group),len(spec))
 for item,(code,a,b) in zip(group,spec):
  label,x,y,w,h,cx,cy=item;pts=[]
  for j in range(256):
   theta=j/256*2*math.pi;dx,dy=math.cos(theta),-math.sin(theta);last=0
   for r in np.arange(0,math.hypot(w,h),.25):
    xx,yy=int(round(cx+r*dx)),int(round(cy+r*dy))
    if 0<=yy<labels.shape[0] and 0<=xx<labels.shape[1] and labels[yy,xx]==label:last=r
   pts.append([cx+last*dx,-cy-last*dy])
  pts=nd.gaussian_filter1d(np.array(pts,dtype=float),2.5,axis=0,mode='wrap');xs=[p[0] for p in pts];ys=[p[1] for p in pts];mx=(max(xs)+min(xs))/2;my=(max(ys)+min(ys))/2
  # The printed A/B dimensions govern the final optical contour, not the
  # aspect ratio of a scanned, potentially rescaled chart.
  contour=[[round((px-mx)*2/(max(xs)-min(xs)),6),round((py-my)*2*(b/a)/(max(ys)-min(ys)),6)] for px,py in pts]
  records.append(dict(id=str(code),name='Cristal '+str(code),width=a,height=b,contour=contour,sourcePage=6,sourceCode=str(code),source='planos de gafas.pdf · tabla óptica',pixelWidth=w,pixelHeight=h))
from pathlib import Path
(Path(args.output)/'lens-library.js').write_text('// Digitized from the 27 numbered optical profiles on page 6; printed A/B define millimetres.\nexport const lensLibrary='+json.dumps(records,separators=(',',':'))+';\nexport const getLensShape=id=>lensLibrary.find(p=>p.id===id);\n')

# Optional authoring tool: Poppler, Pillow, numpy and scipy. No runtime dependency.
from PIL import Image
from scipy import ndimage as nd
import numpy as np
import argparse,subprocess
from pathlib import Path
parser=argparse.ArgumentParser();parser.add_argument('pdf');parser.add_argument('--output',default='public/system-reference-profiles.js');args=parser.parse_args();work=Path('/tmp/fr-system-digitization');work.mkdir(exist_ok=True);subprocess.run(['pdftoppm','-f','2','-l','2','-scale-to','3000','-png',args.pdf,str(work/'reference')],check=True)
im=np.array(Image.open(work/'reference-2.png').convert('RGB'));gray=im.mean(axis=2)
regions={'cat-tech':(1210,235,1875,500),'wayfarer':(2050,650,2960,955),'cat-red':(1230,970,2060,1235),'cat-black':(1070,1280,2220,1650)}
import json,math
records={}
for key,(x0,y0,x1,y1) in regions.items():
 g=gray[y0:y1,x0:x1];rgb=im[y0:y1,x0:x1];mask=(g>80)&(g<210) if key=='cat-tech' else g>200 if key=='wayfarer' else ((rgb[:,:,2].astype(float)-rgb[:,:,0])>7)&(rgb[:,:,1]>40)&(rgb[:,:,2]<200)
 mask=nd.binary_closing(mask,iterations=2);labels,n=nd.label(mask);items=[]
 for i,sl in enumerate(nd.find_objects(labels),1):
  if sl is None:continue
  yy,xx=sl;w=xx.stop-xx.start;h=yy.stop-yy.start;ar=(labels[sl]==i).sum()
  if 120<w<450 and 100<h<280 and ar>10000:items.append((xx.start,i))
 _,label=max(items);component=nd.binary_fill_holes(labels==label);cy,cx=nd.center_of_mass(component);pts=[]
 for j in range(256):
  theta=j*math.pi*2/256;dx,dy=math.cos(theta),-math.sin(theta);last=0
  for r in np.arange(0,500,.25):
   x,y=int(round(cx+r*dx)),int(round(cy+r*dy))
   if 0<=y<component.shape[0] and 0<=x<component.shape[1] and component[y,x]:last=r
  pts.append([cx+last*dx,-cy-last*dy])
 pts=nd.gaussian_filter1d(np.array(pts),2,axis=0,mode='wrap');lo=pts.min(axis=0);hi=pts.max(axis=0);width=51 if key=='cat-tech' else 50 if key=='wayfarer' else 52 if key=='cat-red' else 54;height=48 if key=='cat-tech' else round(width*(hi[1]-lo[1])/(hi[0]-lo[0]),1)
 contour=np.round((pts-(lo+hi)/2)*[2/(hi[0]-lo[0]),2*height/width/(hi[1]-lo[1])],6).tolist();records[key]={'contour':contour,'width':width,'height':height,'aspect':height/width,'source':'sistemaFR.pdf','sourcePage':2,'dimensionStatus':'annotated A/B' if key=='cat-tech' else 'editable nominal scale; photograph has no dimensions','verifiedManufacturerCAD':False}
from pathlib import Path
Path(args.output).write_text('// Optical apertures digitized from sistemaFR.pdf, page 2. Only cat-tech has annotated A/B.\nexport const systemReferenceProfiles='+json.dumps(records,separators=(',',':'))+';\n')

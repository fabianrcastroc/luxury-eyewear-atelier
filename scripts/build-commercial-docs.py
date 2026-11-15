"""Generate editable DOCX and readable PDF manuals from versioned Markdown sources."""
from pathlib import Path
from xml.sax.saxutils import escape
import re, json, zipfile, hashlib, csv
from datetime import datetime
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, PageBreak, KeepTogether
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib import colors
from reportlab.lib.enums import TA_LEFT
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from docx import Document
from docx.shared import Pt, Inches, RGBColor
from docx.oxml import OxmlElement
from docx.oxml.ns import qn
ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/'public/software-docs';OUT.mkdir(parents=True,exist_ok=True)
font='/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf';bold='/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'
pdfmetrics.registerFont(TTFont('FRBody',font));pdfmetrics.registerFont(TTFont('FRBold',bold))
styles=getSampleStyleSheet()
styles.add(ParagraphStyle(name='FRBody',fontName='FRBody',fontSize=9.2,leading=14,spaceAfter=10,textColor=colors.HexColor('#24343a')))
styles.add(ParagraphStyle(name='FRHeading',fontName='FRBold',fontSize=13,leading=18,spaceBefore=15,spaceAfter=8,textColor=colors.HexColor('#16575c'),keepWithNext=True))
styles.add(ParagraphStyle(name='FRCover',fontName='FRBold',fontSize=28,leading=36,spaceAfter=26,textColor=colors.HexColor('#123b41')))
styles.add(ParagraphStyle(name='FRSmall',fontName='FRBody',fontSize=9,leading=14,spaceAfter=10,textColor=colors.HexColor('#4b6469')))
DATE='15 noviembre 2026'
def footer(canvas,doc):
 canvas.saveState();w,h=doc.pagesize;canvas.setStrokeColor(colors.HexColor('#b9cdce'));canvas.line(44,44,w-44,44);canvas.setFont('FRBody',7);canvas.setFillColor(colors.HexColor('#425c61'));canvas.drawString(44,31,'FR eyewear studio · Documentación 2026.11');canvas.drawRightString(w-44,31,str(doc.page));canvas.restoreState()
def mark(canvas,doc):
 footer(canvas,doc)
 if doc.page==1:
  canvas.saveState();canvas.translate(86,doc.pagesize[1]-104);canvas.setFillColor(colors.HexColor('#16575c'));canvas.saveState();canvas.scale(-1,1);canvas.setFont('FRBold',32);canvas.drawString(0,0,'F');canvas.restoreState();canvas.setFont('FRBold',32);canvas.drawString(8,0,'R');canvas.restoreState()
for source in sorted((ROOT/'documentation/commercial').glob('*.md')):
 text=source.read_text();lines=text.splitlines();title=lines[0][2:];slug=source.stem
 story=[Spacer(1,104),Paragraph(escape(title),styles['FRCover']),Paragraph('FR eyewear studio',styles['FRHeading']),Paragraph('Código candidato 1.7.3 · Revisión documental 2026.11<br/>'+DATE+' · Santiago, Chile',styles['FRSmall']),Spacer(1,20),Paragraph('Titular: [COMPLETAR RAZÓN SOCIAL Y RUT]<br/>Soporte: estudiomiscante@gmail.com',styles['FRBody']),Paragraph('Los campos pendientes son editables en el archivo DOCX. Los documentos legales son borradores para revisión profesional. Esta entrega no acredita firma comercial ni servicios de pago/activación en producción.',styles['FRSmall']),PageBreak()]
 doc=Document();sec=doc.sections[0];sec.top_margin=Inches(.8);sec.bottom_margin=Inches(.8);sec.left_margin=Inches(.75);sec.right_margin=Inches(.75)
 normal=doc.styles['Normal'];normal.font.name='Calibri';normal.font.size=Pt(10);normal.paragraph_format.space_after=Pt(8)
 for st in ['Heading 1','Heading 2']:doc.styles[st].font.color.rgb=RGBColor.from_string('16575C')
 doc.add_paragraph('FR eyewear studio','Subtitle');doc.add_heading(title,0);doc.add_paragraph('Código candidato 1.7.3 · Revisión 2026.11\n'+DATE+' · Santiago, Chile');doc.add_paragraph('Titular: [COMPLETAR RAZÓN SOCIAL]\nRUT: [COMPLETAR]\nDomicilio: [COMPLETAR], Santiago, Región Metropolitana, Chile\nSoporte: estudiomiscante@gmail.com');doc.add_paragraph('Documento editable. Los textos legales son borradores para revisión profesional. No acredita distribución comercial firmada.');doc.add_page_break()
 for line in lines[1:]:
  if not line.strip():continue
  if line.startswith('## '):
   story.append(Paragraph(escape(line[3:]),styles['FRHeading']));doc.add_heading(line[3:],1)
  else:
   story.append(Paragraph(escape(line),styles['FRBody']));doc.add_paragraph(line)
 header=sec.header.paragraphs[0];header.text='FR eyewear studio  |  Documentación profesional'
 foot=sec.footer.paragraphs[0];foot.text='Revisión 2026.11 · ';field=OxmlElement('w:fldSimple');field.set(qn('w:instr'),'PAGE');foot._p.append(field)
 doc.core_properties.title=title;doc.core_properties.author='FR eyewear studio';doc.core_properties.subject='Código candidato 1.7.3; titular legal pendiente'
 doc.save(OUT/(slug+'.docx'))
 SimpleDocTemplate(str(OUT/(slug+'.pdf')),title=title,author='FR eyewear studio',pagesize=(595.28,841.89),rightMargin=44,leftMargin=44,topMargin=46,bottomMargin=58).build(story,onFirstPage=mark,onLaterPages=mark)
 (OUT/(slug+'.md')).write_text(text)
rows=[]
for manifest in ['package-lock.json','desktop-fr/package-lock.json']:
 lock=json.loads((ROOT/manifest).read_text());root=lock['packages']['']
 for scope in ['dependencies','devDependencies']:
  for name,spec in root.get(scope,{}).items():
   entry=lock['packages'].get('node_modules/'+name,{})
   rows.append([manifest,scope,name,entry.get('version',spec),entry.get('license','Consultar LICENSE original')])
with (OUT/'inventario-dependencias-directas.csv').open('w',newline='') as f:
 writer=csv.writer(f,lineterminator="\n");writer.writerow(['lockfile','scope','package','version','license_reported']);writer.writerows(rows)
files=sorted(p for p in OUT.iterdir() if p.suffix in ['.pdf','.docx','.md','.csv'])
(OUT/'SHA256SUMS-documentos.txt').write_text(''.join(hashlib.sha256(p.read_bytes()).hexdigest()+'  '+p.name+'\n' for p in files))
with zipfile.ZipFile(OUT/'FR-documentacion-profesional-2026-11.zip','w',zipfile.ZIP_DEFLATED) as z:
 for p in files+[OUT/'SHA256SUMS-documentos.txt']:z.write(p,p.name)
print('Generated',len(files),'documents/assets + ZIP in',OUT)

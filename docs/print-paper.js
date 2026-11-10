export const printPapers=Object.freeze({
 a4:{id:'a4',name:'A4',width:210,height:297},
 carta:{id:'carta',name:'Carta',width:215.9,height:279.4},
 oficio:{id:'oficio',name:'Oficio Chile',width:215.9,height:330.2}
});

export function printPaper(options={}){
 const paper=printPapers[options.paper||'a4'];
 if(!paper)throw new RangeError('Selecciona papel A4, Carta u Oficio Chile.');
 return paper;
}

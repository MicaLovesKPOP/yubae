# Hand-normalized vector traces of the supplied six-column handwritten chart.
# Each path is a monoline outline in 100 x 100 design units, y increasing downwards.
# Marks: n horizontal, v ring, a rising slash, adv falling slash; chart-specific placement preserved.
from numeral_geometry import NUMERAL_PATHS
G=[]
N='M18 13 H82'; V='M50 8 m-3.8 0 a3.8 3.8 0 1 0 7.6 0 a3.8 3.8 0 1 0 -7.6 0'; A='M42 18 L58 4'; D='M42 4 L58 18';
def ring(x,y,r=4): return f'M{x-r} {y} a{r} {r} 0 1 0 {2*r} 0 a{r} {r} 0 1 0 {-2*r} 0'
def diamond(x,y,r=20): return f'M{x} {y-r} L{x+r} {y} {x} {y+r} {x-r} {y} Z'
def add(id,en,ko,cat,path,mark='',fill='',aliases='',group=None):
 G.append(dict(id=id,en=en,ko=ko,category=cat,path=(mark+' '+path).strip(),fill=fill,aliases=aliases.split(',') if aliases else [],group=group or id))
# Column 1
for i,p in enumerate(['M20 21 H80 V81 H20 Z','M26 30 H73 V72 L55 57','M34 25 L18 49 80 38 64 80',NUMERAL_PATHS['3'],NUMERAL_PATHS['4'],'M20 25 L79 20 67 42 M49 23 V83','M22 29 L17 51 82 43 74 72 M50 19 V86','M50 18 V84 M22 72 L18 52 H79 L69 72','M78 23 H20 V82 H77 V38','M20 37 L78 27 20 65 M48 19 V87']): add(str(i),str(i),str(i),'Numbers',p,aliases=['zero','one','two','three','four','five','six','seven','eight','nine'][i])
add('human','Human','사람','People','M50 28 L77 80 H23 Z',N,aliases='person,people')
add('head','Head','머리','People',diamond(50,53,23),N)
add('has','Has','있다','Actions','M39 28 V83 M61 28 V83',V,aliases='exist,have')
add('hole','Hole','구멍','World',ring(50,55,25)+' '+ring(50,55,2.5),N)
meal='M25 35 H75 L68 75 H32 Z M12 55 H88'
add('eat','Eat / drink','먹다 / 마시다','Actions',meal,V,aliases='eat,drink',group='meal')
add('food','Food','음식','World',meal,N,group='meal')
add('bottom','Bottom','아래','Space','M22 27 V80 H78 V27 '+ring(50,63,10),A,aliases='below,lower')
add('or','Or','또는','Grammar','M26 29 L50 80 76 29')
add('and','And','그리고','Grammar','M26 76 L50 26 76 76')
add('speak','Speak','말하다','Actions','M33 28 H67 V84 H33 Z M14 45 L50 66 86 38',V,aliases='sound,talk')
add('above','Above / on','위에','Space',diamond(50,56,28)+' M22 56 H78',A,fill='M50 28 L78 56 H22 Z',aliases='above,on,upper')
add('see','See','보다','Actions','M18 69 L72 31 M18 69 L83 80 M51 46 V74',V,aliases='look')
# Column 2
side=diamond(50,56,28)+' M50 28 V84'
add('left','Left','왼쪽','Space',side,A,fill='M50 28 L22 56 50 84 Z')
add('right','Right','오른쪽','Space',side,A,fill='M50 28 L78 56 50 84 Z')
add('hear','Hear','듣다','Actions','M25 65 V30 H67 Q86 68 54 85 H42 '+ring(52,58,3.5),V,aliases='listen')
add('small','Small','작은','Properties','M25 31 V81 H75 V31 '+ring(50,60,4),A)
add('plural','Plural','복수','Grammar','M22 39 C58 2 87 42 66 71 C50 94 16 76 37 60 Q53 50 67 63',aliases='many,more than one')
kill='M22 82 L50 29 78 82 M15 58 H85'
add('kill','Kill','죽이다','Actions',kill,V,aliases='die,death',group='death')
add('dead','Dead','죽은','Properties','M22 82 L50 29 78 82 M35 58 H65',A,group='death')
add('big','Big','큰','Properties','M20 28 V85 H70 M80 28 V85 '+diamond(49,53,24),A,aliases='large')
add('exists-not','Exists not','없다','Actions','M38 27 V85 M62 27 V85 M17 76 L83 32',V,aliases='absent,not exist,not have')
add('bird','Bird','새','Nature',diamond(50,33,11)+' M12 56 L88 47 M15 56 V72 M34 53 V72 M50 52 V88 M69 50 V70 M86 48 L80 69',N)
add('can','Can','할 수 있다','Grammar','M22 47 L50 20 78 47 M22 79 L50 52 78 79',aliases='able')
add('fruit','Fruit','열매','Nature','M46 40 L72 25 39 29 78 54 51 83 23 63 43 43',N)
add('cow','Cow','소','Nature',ring(50,58,25)+' M12 36 Q24 64 50 47 Q80 50 88 27 '+ring(41,67,3)+' '+ring(59,67,3),N)
add('grass','Grass','풀','Nature','M20 79 L43 31 65 79 M38 75 L72 28 Q85 50 86 81',N)
add('spider','Spider','거미','Nature','M14 42 L50 66 86 31 M50 66 V88 '+diamond(50,43,14)+' '+ring(29,77,4)+' '+ring(72,77,4),N)
add('snake','Snake','뱀','Nature','M68 46 C29 27 5 58 44 60 S92 70 59 81 Q30 91 13 72 '+diamond(76,35,13),N)
# Column 3
add('make','Make','만들다','Actions','M14 80 H88 M22 74 L58 52 M53 32 L77 21 91 66 65 77 Z',V,aliases='create')
add('hand','Hand','손','People','M12 33 H31 L28 76 69 80 72 33 H88',N)
add('foot','Foot','발','People','M12 79 H32 V31 H69 V79 H88',N)
add('body','Body','몸','People','M12 47 C34 16 66 39 48 59 C27 92 103 77 84 43 Q80 37 74 42',N)
add('egg','Egg','알','Nature','M50 25 C19 25 14 85 50 85 S81 25 50 25 Z M35 52 L52 45 41 60 59 60 55 73',N)
add('become','Become','되다','Actions','M19 26 V84 M81 26 V84 M20 55 H70 M57 43 L71 55 57 67',V)
add('minute','Minute','분','Time',ring(50,61,22)+' M50 29 V61',N)
add('hour','Hour','시간','Time',ring(50,61,22)+' M50 28 V61 H66',N)
add('colour','Colour','색','Properties',ring(37,54,4)+' '+ring(63,54,4),N,aliases='color')
waves='M16 44 Q34 23 48 43 T82 37 M16 69 Q34 48 48 68 T82 62'
dots=ring(37,91,3.2)+' '+ring(63,91,3.2)
add('ocean','Ocean','바다','Nature',waves,N,aliases='sea',group='ocean')
add('blue','Blue','파란색','Properties',waves+' '+dots,N,group='ocean')
fire='M50 29 C24 58 25 79 52 73 Q64 68 60 54 C85 43 86 73 70 83'
add('fire','Fire','불','Nature',fire,N,group='fire')
add('red','Red','빨간색','Properties',fire+' '+dots,N,group='fire')
salt=diamond(50,37,13)+' '+diamond(50,73,13)+' '+diamond(22,55,11)+' '+diamond(78,55,11)
saltfill=diamond(22,55,11)+' '+diamond(78,55,11)
add('salt','Salt','소금','World',salt,N,fill=saltfill,group='salt')
add('white','White','흰색','Properties',salt+' '+dots,N,fill=saltfill,group='salt')
# Column 4
add('tree','Wood / tree','나무','Nature','M50 26 L80 55 H20 Z M50 55 V87',N,aliases='wood,tree')
addshape=ring(37,51,19)+' '+ring(62,63,19)
add('add','Add','더하다','Numbers',addshape,V,aliases='plus,combine',group='addition')
add('purple','Purple','보라색','Properties','M31 26 L14 53 34 71 50 55 66 71 86 53 69 26 '+dots,N)
add('minus','Minus','빼다','Numbers','M70 35 C43 11 10 57 38 77 Q49 85 59 82 Q31 65 70 35 Z',V,aliases='subtract')
add('water','Water','물','Nature','M50 28 C43 45 25 55 34 70 C40 86 63 86 69 69 C75 54 56 43 50 28 Z',N)
add('sand','Sand','모래','World','M22 34 L77 73 M15 48 L65 84 M49 26 L13 76 M72 29 L35 84',N)
glass='M36 28 V80 M64 28 V80 M17 45 H83 M17 65 H83'
add('glass','Glass','유리','World',glass,N,group='glass')
add('transparent','Transparent','투명한','Properties',glass+' '+dots,N,aliases='clear',group='glass')
add('path','Path','길','Space','M34 34 L16 72 M60 34 L85 72',N,aliases='road')
coal='M31 39 H69 L83 73 H17 Z'
add('charcoal','Charcoal','숯','World',coal,N,group='charcoal')
add('black','Black','검은색','Properties',coal+' '+dots,N,group='charcoal')
daybody=ring(50,56,24)
add('day','Day','날','Time',daybody+' '+ring(26,56,5)+' '+ring(74,56,5),N,fill=ring(74,56,4))
add('earth','Earth','지구','Nature','M13 35 H87 V78 H13 Z '+diamond(50,56,19),N)
add('sun','Sun','태양','Nature','M24 30 V51 Q24 80 50 83 Q76 80 76 51 V30 M31 68 L50 48 69 68',N)
add('orbit','Orbit','돌다','Actions',ring(50,57,23)+' M22 32 L44 49',V,aliases='rotate')
add('end','End','끝','Space','M18 56 H82 M39 31 L67 56 39 81 M82 26 V85',D,aliases='last,final')
# Column 5
god='M25 31 H75 L25 79 H75 Z'
add('god','God','신','People',god,N,group='god')
add('divine','Divine','신의','Properties',god,A,group='god')
add('moon','Moon','달','Nature',ring(50,55,25)+' M59 31 C28 36 32 77 64 72',N)
shadow='M20 29 H51 V81 H20 Z M51 53 H75 V81 H51 Z'
add('shadow','Shadow','그림자','World',shadow,N,fill='M51 53 H75 V81 H51 Z',group='shadow')
add('cover','Cover','가리다','Actions',shadow,V,fill='M51 53 H75 V81 H51 Z',aliases='hide',group='shadow')
add('you','You','당신','People','M25 30 V56 Q25 82 50 82 Q75 82 75 56 V30',N)
add('daytime','Daytime','낮','Time',daybody+' '+ring(26,56,5),N,aliases='daylight',group='daynight')
add('night','Night','밤','Time',daybody+' '+ring(74,56,5),N,fill=ring(74,56,4),group='daynight')
add('test','Test','시험','World','M34 28 L15 52 50 85 85 52 66 28 '+ring(50,55,4),N,aliases='trial')
add('live','Live','살다','Actions','M25 78 L50 30 75 78',V,aliases='survive')
tri='M50 31 L77 77 H23 Z'; points=' '.join(ring(x,y,4.5) for x,y in [(50,31),(77,77),(23,77)])
add('number','Number','숫자','Numbers',tri+' '+points,N,fill=points)
magic='M18 28 H82 V85 H18 Z M39 42 H61 L39 68 H61 Z'; mpoints=' '.join(ring(x,y,4) for x,y in [(18,28),(82,28),(82,85),(18,85)])
add('magic-square','Magic square','마방진','Numbers',magic+' '+mpoints,N,fill=mpoints,aliases='grid')
for id,en,ko,coords in [('horizontal','Horizontal','가로',[(19,55),(81,55)]),('vertical','Vertical','세로',[(50,27),(50,85)]),('diagonal','Diagonal','대각선',[(23,81),(77,30)])]:
 (x1,y1),(x2,y2)=coords; pts=ring(x1,y1,4.5)+' '+ring(x2,y2,4.5); add(id,en,ko,'Space',f'M{x1} {y1} L{x2} {y2} '+pts,A,fill=pts)
add('sum','Sum','합','Numbers',addshape,N,group='addition')
add('pass','Pass','통과하다','Actions','M20 25 V48 H76 L61 34 M20 83 V62 H79 L62 77',V)
# Column 6
add('poison','Poison','독','World','M15 42 H85 L50 84 15 42 M50 26 V84',N)
add('spear','Spear','창','World','M22 81 L78 30 M78 81 L22 30 M13 25 L34 32 22 43 Z M87 25 L66 32 78 43 Z',N,fill='M13 25 L34 32 22 43 Z M87 25 L66 32 78 43 Z')
add('then','Then','그러면','Grammar','M13 58 L87 48 M59 24 L87 48 64 80',aliases='if then')
add('place','Place','곳','Space','M50 26 V83 M13 45 L50 83 87 45 M29 41 L50 83 69 41',N,aliases='here')
add('floor','Floor','바닥','Space','M50 26 V80 M30 54 L50 80 70 54 M14 84 H86',N)
add('dwell','Dwell','거주하다','Actions','M17 26 V83 H83 V26 M34 63 L50 35 66 63',V,aliases='reside')
add('in','In','안에','Grammar','M19 35 C15 86 49 97 53 51 C56 11 90 19 80 78',aliases='inside')
# Stable PUA assignments by chart column/order, never by category or sorting.
for i,g in enumerate(G): g.update(cp=0xE000+i,char=chr(0xE000+i),status='handwritten-chart reconstruction')
assert len(G)==93, len(G)

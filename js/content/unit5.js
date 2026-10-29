// Original AA SL calculus lessons, verified against the IB first-assessment-2021 guide.
import { F, M, A, tbl } from './helpers.js';
import { POWER_KEYS } from '../calc.js';
const c=(title,html)=>({title,html});
const n=(q,answer,why,unit='')=>({type:'num',cmd:'Calculate',q,answer,tol:0.001,why,unit});
const t=(q,answer,why)=>({type:'tf',q,answer,why});
const m=(q,options,answer,why)=>({type:'mcq',cmd:'Identify',q,options,answer,why});
const w=(title,intro,steps,takeaway)=>({title,intro,steps:steps.map(([prompt,answer])=>({prompt,answer})),takeaway});
const lab=(title,items)=>({type:'scenarios',title,challenge:'Make every mathematical decision correctly.',items:items.map(([s,a,b,fb])=>({s,options:[{t:a,ok:true,fb},{t:b,ok:false,fb}]}))});
const s=(id,title,goal,hook,cards,l,worked,quiz,explain)=>({id,title,goal,hook,cards,labs:[l],worked,quiz:quiz.map((q,i)=>({id:`${id}-${i+1}`,...q})),explain,emoji:'🛹',minutes:12,hl:false});
export const unit5={id:'5',title:'Calculus',emoji:'🛹',calcKeys:POWER_KEYS,
blurb:'Design LineLab skate park: measure a ramp’s slope, optimise a training zone and track a skater. Connect graphs, derivatives and integrals.',sections:[
s('5.1','Limits and the derivative','interpret a derivative as a limiting gradient and an instantaneous rate.',
'You are designing a curved ramp for LineLab. A ruler measures the average slope between two points, but a skater feels the steepness at one point. What happens when those points get closer and closer?',[
c('A secant gives an average',`<p>A <b>secant</b> joins two points on a curve. Its gradient is an average rate of change.</p>${F`m=\frac{f(x+h)-f(x)}h`}<div class="example">For a squared ramp, from x = 2 to x = 3 the height rises from 4 to 9, so the average gradient is 5.</div>`),
c('A derivative is a limit',`<p>The <b>derivative</b> is the instantaneous rate of change. A <b>limit</b> is a value approached as an input gets close to a target.</p>${F`f'(x)=\lim_{h\to0}\frac{f(x+h)-f(x)}h`}<p>For ${M`f(x)=x^2`}, simplify the fraction to ${M`2x+h`}. As h tends to zero, the derivative tends to 2x.</p>`),
c('Give the rate meaning','<p>At x = 2, the squared ramp’s gradient is 4: locally its height changes about four times as fast as horizontal distance. Height and gradient are different quantities.</p><div class="tip"><b>Interpret</b> means explain the quantities and units. Taking a limit does not allow division by zero; use nearby nonzero separations.</div>')],
lab('Shrink the gap',[
['At x = 2, a secant has gradient 4 + h. As h approaches zero…','The gradient approaches 4','The gradient approaches zero','Only the h term vanishes.'],
['Your classmate substitutes h = 0 into the original quotient.','Simplify before taking the limit','Accept zero divided by zero','The quotient is undefined at zero; the limit concerns nearby values.'],
['The derivative at a point is negative.','The tangent slopes down there','The height must be negative','The derivative measures slope rather than height.']]),
w('Estimate a local gradient',F`f(x)=x^2,\quad x=3`,[
['Form the difference quotient.',F`\frac{(3+h)^2-9}h`],
['Simplify for nonzero h.',F`\frac{6h+h^2}h=6+h`],
['Take the limit and interpret.','As h approaches zero, the gradient approaches 6. This is the local steepness at x = 3.']],
'Simplify before taking the limit; do not substitute into a zero denominator.'),[
m('What does a derivative represent?',['Instantaneous rate','Accumulated area','Average coordinate','Horizontal intercept'],0,'A derivative is an instantaneous rate, shown by tangent gradient.'),
t('A negative derivative forces a negative function value.',false,'A ramp can be above ground while sloping down.'),
n('Complete the limiting-gradient table.'+tbl(['x','Derivative 2x'],[['3',A(6,true)]]),6,'The derivative is 2x; at x = 3 it is 6.'),
n('At x = 2 the secant gradient is 4 + h. Find it for h = 0.01.',4.01,'Substitute h = 0.01 into the simplified expression.'),
m('“h tends to zero” asks you to consider…',['h exactly equal to zero','h close to zero','x exactly equal to zero','f exactly equal to zero'],1,'A limit studies nearby values; the separation remains nonzero in the quotient.'),
t('The gradient of a displacement–time graph gives velocity.',true,'Velocity is the instantaneous rate of change of displacement.')],
'Text a mate how shrinking a secant reveals the slope of a curved ramp, without making division by zero valid.'),

s('5.2','Increasing and decreasing functions','use derivative signs to find intervals of increase and decrease.',
'LineLab’s ramp rises, reaches a crest, then drops. A single gradient does not describe the whole route. A sign map of the derivative tells you how height behaves along each interval.',[
c('Read the derivative sign',`<p>A function is <b>increasing</b> when its values rise as x rises, and <b>decreasing</b> when they fall.</p>${F`f'(x)>0\Rightarrow\text{increasing}`}${F`f'(x)<0\Rightarrow\text{decreasing}`}<p>A rising ramp can be below ground level: height and direction of change are separate.</p>`),
c('Make a sign chart',`<p>Find zeros and undefined points of the [[derivative]], then test each interval. For LineLab’s ${M`f(x)=6x-x^2`}, the derivative is ${M`6-2x`}. It is positive before x = 3 and negative afterwards.</p><div class="example">On the physical interval 0 ≤ x ≤ 6, the ramp rises to x = 3 and falls after it.</div>`),
c('Stationary does not always mean turning','<p>A <b>stationary point</b> has zero derivative. The curve might turn, or it might continue through a horizontal tangent.</p><div class="tip"><b>Find the intervals</b>: give ranges of x, test both sides and respect the domain. A zero derivative alone does not classify the point.</div>')],
lab('Follow the sign chart',[
['The derivative is positive before x = 3 and negative after it.','The ramp rises then falls','The ramp falls then rises','The derivative sign describes the direction of height change.'],
['The derivative is zero at a point but positive on both sides.','It need not be a turning point','It must be a local maximum','There is no change in the direction of increase.'],
['The physical domain is 0 ≤ x ≤ 6.','Restrict the intervals to that domain','Include every real x','The mathematical extension may lie outside the ramp.']]),
w('Find the rising section',F`f(x)=6x-x^2,\quad0\le x\le6`,[
['Differentiate.',F`f'(x)=6-2x`],['Solve for positive derivative.',F`6-2x>0\Rightarrow x<3`],['State both intervals.','Increasing on (0, 3); decreasing on (3, 6). At x = 3 the tangent is horizontal.']],
'Use a sign chart to justify intervals rather than guessing from one point.'),[
m('A negative derivative means the function is…',['above the axis','decreasing','increasing','below the axis'],1,'Its values fall as x increases.'),
t('Every stationary point is a turning point.',false,'The cubic function has a stationary point at zero but keeps increasing.'),
n('Complete the derivative table.'+tbl(['Derivative','x','Value'],[['6 − 2x','2',A(2,true)]]),2,'Substitute x = 2: 6 − 4 = 2.'),
m('Where is 6 − 2x positive?',['x > 6','x > 3','x < 3','x < 0 only'],2,'Solving 6 − 2x > 0 gives x < 3.'),
n('For derivative 6 − 2x, find the stationary x-coordinate.',3,'Set 6 − 2x equal to zero and solve.'),
t('A graph can be decreasing while remaining above the horizontal axis.',true,'Its height can stay positive as that height decreases.')],
'Explain how you can identify a rising ramp using only its derivative.'),

s('5.3','Differentiating integer powers','differentiate integer powers, sums and polynomial expressions.',
'The ramp designer sends you a polynomial instead of a sketch. Estimating a new slope at every point would take ages. A reusable derivative formula turns the whole plan into a slope map.',[
c('The power rule',`<p>The <b>power rule</b> multiplies by the exponent, then reduces that exponent by one.</p>${F`\frac{d}{dx}(ax^n)=anx^{n-1}`}<p>Here n is an integer. A constant differentiates to zero because its value never changes.</p><div class="example">A ramp term ${M`3x^4`} has derivative ${M`12x^3`}.</div>`),
c('Differentiate each term',`${F`f(x)=2x^3-3x^2+4x+7`}${F`f'(x)=6x^2-6x+4`}<p>Keep the coefficient signs. A linear term becomes its coefficient; an added constant disappears.</p>`),
c('Negative exponents are allowed',`${F`\frac{d}{dx}(x^{-2})=-2x^{-3}`}<p>Rewrite reciprocal expressions as powers first. Keep restrictions: these reciprocal terms are undefined at x = 0.</p><div class="tip"><b>Find the gradient at a point</b>: differentiate first and substitute second. Substitution before differentiation loses the function.</div>`)],
lab('Choose the slope formula',[
['Differentiate the ramp term 4x³.','12x²','4x²','Multiply the coefficient by 3, then reduce the exponent to 2.'],
['Differentiate a vertical height offset of 7.','0','7','A constant offset changes height but not steepness.'],
['Differentiate x⁻².','−2x⁻³','−2x⁻¹','Subtracting 1 from −2 gives −3.']]),
w('Gradient at a ramp join',F`f(x)=2x^3-3x^2+4x+7,\quad x=2`,[
['Differentiate each term.',F`f'(x)=6x^2-6x+4`],['Substitute x = 2.',F`f'(2)=6(2)^2-6(2)+4`],['Simplify.','The gradient is 24 − 12 + 4 = 16.']],
'Differentiate first, then evaluate the derivative at the given coordinate.'),[
m('Differentiate 5x⁴.',['5x³','20x³','20x⁵','x⁵'],1,'The coefficient becomes 5 × 4 and the exponent becomes 3.'),
t('Adding a constant changes the derivative.',false,'A constant vertical shift does not alter slope.'),
n('Complete the gradient table.'+tbl(['Ramp','x','Gradient'],[['2x³ − 3x² + 4x + 7','2',A(16,true)]]),16,'The derivative is 6x² − 6x + 4, which equals 16 at x = 2.'),
m('Differentiate x⁻¹.',['x⁻²','−x⁻²','−1','ln x'],1,'The power rule gives −1 times x to the power −2.'),
n('For a derivative 6x, find the gradient at x = −2.',-12,'Substitute −2 to get 6 × (−2) = −12.'),
t('The derivative of 4x is 4.',true,'A straight line has constant gradient equal to its coefficient.')],
'Teach a mate the power rule with one positive exponent, one negative exponent and a constant.'),

s('5.4','Tangents and normals','find equations of tangent and normal lines at a point on a curve.',
'A straight ramp needs to join a curved section smoothly. Meeting at the same point is only half the job: their directions must agree. A perpendicular support needs a second line called the normal.',[
c('The tangent equation',`<p>A <b>tangent</b> has the local direction of a differentiable curve at its contact point.</p>${F`y-y_0=f'(x_0)(x-x_0)`}<div class="example">For ${M`y=x^2`} at x = 1, the point is (1, 1), the gradient is 2, and the tangent is ${M`y-1=2(x-1)`}.</div>`),
c('The normal is perpendicular',`<p>A <b>normal</b> is perpendicular to the tangent at the contact point.</p>${F`m_n=-\frac1{m_t}`}<p>A tangent gradient of 2 gives a normal gradient of −1/2. Both lines pass through the same point.</p>`),
c('Handle a horizontal tangent','<p>If the tangent gradient is zero, its normal is vertical. Write x equal to the contact coordinate; do not divide by zero.</p><div class="tip"><b>Find an equation</b> means give a line, not just a gradient. Show the point and the gradient before using point–slope form.</div>')],
lab('Build the supports',[
['A tangent has slope −4. Its normal has slope…','1/4','−1/4','Perpendicular finite gradients multiply to −1.'],
['A horizontal tangent touches at (2, 5).','The normal is x = 2','The normal is y = 5','A vertical normal fixes the horizontal coordinate.'],
['A line has the right slope but misses the contact point.','It is not the required tangent','The slope alone is sufficient','A line equation needs the correct point as well as direction.']]),
w('A smooth join',F`y=x^2,\quad x=1`,[
['Find the point and gradient.',F`(x_0,y_0)=(1,1),\quad f'(1)=2`],
['Write the tangent.',F`y-1=2(x-1)\Rightarrow y=2x-1`],
['Write the normal.',F`y-1=-\frac12(x-1)\Rightarrow y=-\frac12x+\frac32`]],
'Use a negative reciprocal only when the tangent gradient is finite and nonzero.'),[
m('A tangent gradient is 3. The normal gradient is…',['−3','1/3','−1/3','3'],2,'3 × (−1/3) = −1.'),
t('The tangent and normal use the same contact point.',true,'Both lines pass through the given point on the curve.'),
n('Find the tangent intercept.'+tbl(['Contact','Slope','y-intercept'],[['(1, 1)','2',A(-1,true)]]),-1,'Simplify y − 1 = 2(x − 1) to y = 2x − 1.'),
m('The normal to a horizontal tangent at (4, 7) is…',['y = 4','x = 7','y = 7','x = 4'],3,'A vertical line through that point has equation x = 4.'),
n('Find the tangent gradient to the squared ramp at x = 3.',6,'Its derivative is 2x, so the gradient is 6.'),
t('A tangent cannot meet the curve at any other point.',false,'Tangency describes local direction; further intersections can occur.')],
'Explain to the builder how tangents and normals differ, including a horizontal tangent.'),

s('5.5','Introducing integration','recover a function from its derivative and interpret positive definite integrals.',
'A sensor records the ramp’s slope but the height plan goes missing. Can you recover the shape? Reversing differentiation gives a family of ramps, and one measured height selects the right one.',[
c('Reverse differentiation',`<p>An <b>antiderivative</b> differentiates back to the original function. An <b>indefinite integral</b> describes a family with an arbitrary constant C.</p>${F`\int ax^n\,dx=\frac{a}{n+1}x^{n+1}+C\quad(n\ne-1)`}<div class="example">Slope 2x gives height ${M`x^2+C`}. Different vertical shifts all have that slope.</div>`),
c('Use a boundary condition',`${F`h'(x)=2x,\quad h(1)=3`}${F`h(x)=x^2+C,\quad3=1+C`}<p>Thus C = 2 and the profile is ${M`h(x)=x^2+2`}. The known point fixes the vertical position.</p>`),
c('Accumulate with bounds',`<p>A <b>definite integral</b> has lower and upper bounds. For a nonnegative graph, it gives the area under the curve.</p>${F`A=\int_a^b f(x)\,dx\quad(f(x)\ge0)`}<p>On a graphing calculator, enter the function and both bounds, then check the graph and domain.</p><div class="tip"><b>Calculate area</b>: show the bounded integral before the result. A height–distance graph measured in metres gives area in square metres.</div>`)],
lab('Recover the missing plan',[
['You integrate a slope with no known height.','Keep an arbitrary constant','Set the constant to zero','Different vertical shifts share the same derivative.'],
['You integrate positive ramp height over horizontal distance.','The result is cross-sectional area','The result is instantaneous slope','Integration adds thin height-times-width strips.'],
['The integrand is x⁻¹.','Use the logarithm rule in 5.10','Apply the power rule unchanged','The usual antiderivative power rule excludes exponent −1.']]),
w('Reconstruct a height',F`h'(x)=4x,\quad h(1)=5`,[
['Integrate the slope.',F`h(x)=2x^2+C`],['Use the point.',F`5=2(1)^2+C\Rightarrow C=3`],['Check the profile.',F`h(x)=2x^2+3,\quad h'(x)=4x,\quad h(1)=5`]],
'Check by differentiation and use the condition to determine the constant.'),[
m('An antiderivative of 6x is…',['6x²','3x²','3x','6'],1,'Differentiating 3x² gives 6x.'),
t('A general indefinite integral can omit C.',false,'It describes a family because differentiation removes any constant.'),
n('Find the integration constant.'+tbl(['Slope','Known point','C in h = 2x² + C'],[['4x','h(1) = 5',A(3,true)]]),3,'5 = 2 + C gives C = 3.'),
n('Find the area below a constant height of 3 m across a 4 m horizontal span.',12,'The area is a rectangle: 3 × 4 = 12.','m²'),
m('The bounds of a definite integral specify…',['the slope at the start','the integration constant','the accumulation interval','the derivative formula'],2,'The lower and upper bounds set where accumulation begins and ends.'),
t('Integrating metres of height over metres of width gives square metres.',true,'The units of height and width multiply.')],
'Tell a mate why knowing every slope still does not fix the ramp’s absolute height.'),

s('5.6','Chain, product and quotient rules','differentiate standard functions and their combinations.',
'LineLab adds a wavy section and an exponential transition. Polynomial rules alone cannot describe every slope. Choose the right tool from the expression’s structure before doing the algebra.',[
c('Standard derivatives',`${F`(x^n)'=nx^{n-1}\quad(n\in\mathbb Q)`}${F`(\sin x)'=\cos x,\quad(\cos x)'=-\sin x`}${F`(e^x)'=e^x,\quad(\ln x)'=1/x`}<p>Trigonometric derivatives assume radians. The real function ln x requires positive x.</p>`),
c('Chain rule',`<p>The <b>chain rule</b> differentiates a function inside a function.</p>${F`[f(g(x))]'=f'(g(x))g'(x)`}<div class="example">The wavy ramp ${M`\sin(3x)`} has derivative ${M`3\cos(3x)`}. The extra factor comes from differentiating the inside.</div>`),
c('Product rule',`<p>The <b>product rule</b> handles two changing factors.</p>${F`(uv)'=u'v+uv'`}<p>For ${M`xe^x`}, it gives ${M`e^x+xe^x`}. Multiplying the two derivatives is incorrect.</p>`),
c('Quotient rule',`<p>The <b>quotient rule</b> handles a changing numerator and denominator.</p>${F`(u/v)'=\frac{u'v-uv'}{v^2}`}<p>For ${M`x/(x+1)`}, it gives ${M`1/(x+1)^2`}, where x ≠ −1.</p><div class="tip"><b>Differentiate</b>: retain brackets around composite arguments and the whole quotient numerator. Several rules can be needed together.</div>`)],
lab('Choose the calculus tool',[
['The expression is sin(3x).','Use the chain rule','Multiply sin x by 3','The inner function contributes an extra derivative factor.'],
['The expression is x times eˣ.','Use the product rule','Multiply the two derivatives','Differentiate each factor in turn, keeping the other unchanged.'],
['The sine input is measured in degrees.','Convert to radians for standard rules','Use the radian formula unchanged','The standard trigonometric identities require radians.']]),
w('A product with a wavy factor',F`h(x)=(x^2+1)\sin(2x)`,[
['Identify the structure.','It is a product of a polynomial and a composite sine function.'],
['Differentiate both factors.',F`u'=2x,\quad v'=2\cos(2x)`],
['Combine the two contributions.',F`h'(x)=2x\sin(2x)+2(x^2+1)\cos(2x)`]],
'Choose the outer structure first, then apply any chain rule inside it.'),[
m('Differentiate sin(4x).',['cos(4x)','4cos(4x)','−4sin(4x)','sin(4)'],1,'Differentiate the sine and multiply by the inner derivative 4.'),
t('The derivative of cos x is sin x.',false,'It is −sin x; the negative sign matters.'),
n('Complete the composite derivative table.'+tbl(['Function','x','Derivative'],[['(3x + 1)²','1',A(24,true)]]),24,'The derivative is 6(3x + 1), giving 24 at x = 1.'),
m('Differentiate x eˣ.',['eˣ','x eˣ','eˣ + x eˣ','1 + eˣ'],2,'Apply u′v + uv′ to the two factors.'),
n('Find the derivative of ln x at x = 2.',0.5,'The derivative is 1/x, giving one half.'),
t('Trigonometric derivative formulas use radian inputs.',true,'Degree inputs require a conversion factor.')],
'Explain how to choose between chain, product and quotient rules before calculating.'),

s('5.7','The second derivative','connect the graphs of a function and its first and second derivatives.',
'Two ramps can have the same steepness at one point yet feel different just beyond it. One gets steeper while the other flattens. Differentiating the slope tells you which is happening.',[
c('Differentiate the derivative',`<p>The <b>second derivative</b> measures how the first derivative changes.</p>${F`f''(x)=\frac{d}{dx}f'(x)=\frac{d^2y}{dx^2}`}<div class="example">For the cubic ramp ${M`f(x)=x^3`}, the slope is ${M`3x^2`} and its rate of change is ${M`6x`}.</div>`),
c('Link three graphs','<p>The height of the derivative graph gives the original graph’s slope. The height of the second-derivative graph gives the slope of the first-derivative graph.</p><p>A positive first derivative and a negative second derivative mean the ramp rises but becomes less steep.</p>'),
c('Read concavity',`<p><b>Concavity</b> describes bending. Positive second derivative means concave up, with increasing slopes; negative means concave down, with decreasing slopes.</p>${F`f''>0:\text{concave up}`}${F`f''<0:\text{concave down}`}<div class="tip"><b>Describe</b> height, direction and bending separately. A positive second derivative does not guarantee the function itself is increasing.</div>`)],
lab('Read the graph family',[
['The first derivative is −3; the second derivative is 2.','Falling, with slope increasing','Rising, with slope increasing','Direction comes from the first derivative, not the second.'],
['The derivative graph is horizontal at height 4.','The second derivative is zero','The second derivative is four','A horizontal graph has zero slope.'],
['The second derivative is negative throughout an interval.','The first derivative decreases','The original height is negative','It is the rate of change of the first derivative.']]),
w('Compare two points on a cubic ramp',F`h(x)=x^3-3x`,[
['Differentiate twice.',F`h'(x)=3x^2-3,\quad h''(x)=6x`],
['Describe x = −2.','The slope is 9 and the second derivative is −12: rising, but slopes are decreasing.'],
['Describe x = 2.','The slope is 9 and the second derivative is 12: rising, and slopes are increasing.']],
'Equal slopes need not mean equal concavity.'),[
m('The second derivative measures…',['total accumulated area','the height of the curve','the change in slope','horizontal distance'],2,'It is the derivative of the first derivative.'),
t('Positive second derivative guarantees an increasing function.',false,'A falling function can have slopes becoming less negative.'),
n('Complete the second-derivative table.'+tbl(['Function','x','Second derivative'],[['x³ − 3x','2',A(12,true)]]),12,'The second derivative is 6x, which equals 12 at x = 2.'),
m('A function is concave down when…',['f is negative','f′ is negative','f″ is negative','f″ is positive'],2,'Concavity depends on the second derivative sign.'),
n('Find the second derivative of 4x² + 3x.',8,'The first derivative is 8x + 3; differentiating again gives 8.'),
t('A rising derivative graph means the original graph has increasing slopes.',true,'Its plotted values are the slopes of the original function.')],
'Describe a rising ramp that becomes less steep, using the first and second derivatives.'),

s('5.8','Optimisation and points of inflexion','classify stationary points, optimise on a domain and test concavity changes.',
'LineLab has 20 metres of rail for a rectangular training zone. You want the biggest area, not just a shape that looks spacious. A zero derivative finds a candidate, but how do you prove it is the best one?',[
c('Local maxima and minima','<p>A <b>local maximum</b> is at least as high as nearby values; a <b>local minimum</b> is at least as low. At a differentiable interior extremum, the derivative is zero.</p><p>A derivative sign change from positive to negative proves a maximum; negative to positive proves a minimum. At a stationary point, a negative second derivative proves a maximum and a positive one proves a minimum.</p>'),
c('Optimise within the domain',`<p><b>Optimisation</b> means finding the best permitted value. Build an objective using one variable, state its domain, find stationary candidates, then compare them with endpoints.</p><div class="example">With 20 m of rail, width x gives length 10 − x and area ${M`A=x(10-x)`}, for 0 ≤ x ≤ 10.</div>`),
c('An inflexion changes concavity',`<p>A <b>point of inflexion</b> is where concavity changes. A zero second derivative is only a candidate: test both sides.</p><p>The cubic ${M`x^3`} changes concavity at zero, but the quartic ${M`x^4`} does not. An inflexion can have nonzero gradient.</p><div class="tip"><b>Show that</b> requires a classification test, not just setting a derivative to zero. For a global optimum, check endpoints too.</div>`)],
lab('Test the candidates',[
['At a stationary point, the second derivative is −8.','It is a local maximum','It is a local minimum','A negative second derivative at a stationary point is a sufficient maximum test.'],
['The second derivative is zero at one point, positive on both sides.','There is no inflexion there','There must be an inflexion','Concavity has not changed.'],
['The objective is restricted to a closed interval.','Check endpoints and stationary points','Check stationary points only','A permitted endpoint can give the greatest value.']]),
w('Maximise the fenced area','<p>The rectangular zone has perimeter 20 m.</p>',[
['Write the objective and domain.',F`A=x(10-x),\quad0\le x\le10`],
['Find the stationary candidate.',F`A'=10-2x=0\Rightarrow x=5`],
['Test and compare.','The second derivative is −2. The candidate gives 25 m², while both endpoints give zero. The maximum is therefore 25 m², using a 5 m square.']],
'State the optimum, dimensions and units, and justify why the candidate is best.'),[
m('Derivative changes from positive to negative. The stationary point is a…',['local maximum','local minimum','vertical asymptote','necessary inflexion'],0,'The function rises before it and falls after it.'),
t('A zero second derivative proves an inflexion.',false,'The second derivative must change sign; x⁴ is a counterexample.'),
n('Complete the area table.'+tbl(['Perimeter (m)','Optimal width (m)','Largest area (m²)'],[['20','5',A(25,true)]]),25,'The length is also 5 m, so area is 25 m².'),
m('Which proves a stationary point is a local minimum?',['Positive height','Positive first derivative','Positive second derivative','Zero second derivative'],2,'A positive second derivative at a stationary point is a sufficient minimum test.'),
n('Find the stationary x for A(x) = 10x − x².',5,'Solve 10 − 2x = 0.'),
t('An inflexion can have a nonzero gradient.',true,'The function x³ + x changes concavity at zero, with gradient 1.')],
'Tell a mate why zero derivatives locate candidates but tests and endpoints decide the answer.'),

s('5.9','Displacement, velocity and distance','solve motion problems and distinguish signed displacement from total distance.',
'A skater rolls forwards, stops, then rolls backwards along a straight track. The final position is close to the start, but the wheels travelled much farther. Signed velocity lets you separate those two results.',[
c('The motion ladder',`<p><b>Displacement</b> is signed position change. <b>Velocity</b> is its rate of change; <b>acceleration</b> is velocity’s rate of change. <b>Speed</b> is the magnitude of velocity.</p>${F`v=\frac{ds}{dt},\quad a=\frac{dv}{dt}=\frac{d^2s}{dt^2}`}<p>Negative velocity indicates a direction, not negative speed.</p>`),
c('Integrate velocity',`${F`\text{displacement}=\int_{t_1}^{t_2}v(t)\,dt`}${F`\text{distance}=\int_{t_1}^{t_2}|v(t)|\,dt`}<p>For distance by hand, find velocity zeros where the sign changes, split the interval and add the magnitudes of the signed integrals.</p>`),
c('Stopping and speeding up','<p>At rest, velocity is zero. A direction change requires velocity to change sign. Speed increases when velocity and acceleration have the same sign, and decreases when they have opposite signs.</p><div class="tip"><b>Find total distance</b> means account for reversals. Keep displacement in metres, velocity in metres per second and acceleration in metres per second squared.</div>')],
lab('Follow the skater',[
['Velocity and acceleration are both negative.','Moving backwards and speeding up','Moving backwards and slowing down','Velocity becomes more negative, increasing its magnitude.'],
['Velocity changes from positive to negative.','The skater reverses direction','Only the acceleration changes','The sign of velocity sets direction.'],
['Positive and negative signed areas cancel.','Displacement can be zero','Distance must be zero','Distance adds magnitudes rather than cancelling directions.']]),
w('A trip with a reversal',F`v(t)=2t-4,\quad0\le t\le3`,[
['Find the reversal.',F`2t-4=0\Rightarrow t=2`],
['Find signed displacement.',F`\int_0^3(2t-4)\,dt=[t^2-4t]_0^3=-3`],
['Find total distance.','The first segment has displacement −4 m and the second +1 m. Distance is 4 + 1 = 5 m.']],
'Split at velocity sign changes; add segment magnitudes for total distance.'),[
m('Velocity is −3 m/s. Speed is…',['−3 m/s','3 m/s','0 m/s','9 m/s'],1,'Speed is the magnitude of velocity.'),
t('Positive acceleration always means speeding up.',false,'If velocity is negative, positive acceleration can reduce speed.'),
n('Find total distance.'+tbl(['Segment','Displacement (m)'],[['First','−4'],['Second','1'],['Total distance',A(5,true)]]),5,'Add magnitudes: 4 + 1 = 5 m.','m'),
n('For v(t) = 2t − 4, find the time when the skater is at rest.',2,'Set velocity equal to zero and solve.','s'),
m('The derivative of velocity is…',['displacement','total distance','acceleration','elapsed time'],2,'Acceleration measures how velocity changes with time.'),
n('For s(t) = t³ − 3t, find acceleration at t = 2.',12,'Velocity is 3t² − 3; acceleration is 6t, giving 12.','m/s²')],
'Explain why returning to the start gives zero displacement but can involve lots of distance.'),

s('5.10','Integration rules and substitution','integrate standard functions, linear composites and reverse-chain-rule expressions.',
'LineLab’s motion sensor now reports a sine wave instead of a polynomial. You still need a position function. Standard antiderivatives and the reverse chain rule let you rebuild it systematically.',[
c('Standard antiderivatives',`${F`\int x^n\,dx=\frac{x^{n+1}}{n+1}+C\ (n\ne-1)`}${F`\int\sin x\,dx=-\cos x+C`}${F`\int\cos x\,dx=\sin x+C`}${F`\int e^x\,dx=e^x+C,\quad\int\frac1x\,dx=\ln|x|+C`}<p>Rational powers are allowed where defined. The logarithm rule excludes zero; trigonometric input uses radians.</p>`),
c('Undo a linear inside function',`${F`\int\cos(ax+b)\,dx=\frac1a\sin(ax+b)+C\quad(a\ne0)`}<p>The factor 1/a undoes the factor introduced by differentiation. The same idea applies to powers and exponentials.</p><div class="example">Velocity cos(2t) gives position ${M`\frac12\sin(2t)+C`}.</div>`),
c('Substitution reverses the chain rule',`<p><b>Substitution</b> replaces an inside expression with a new variable. Look for its derivative elsewhere in the integrand.</p>${F`\int2x(x^2+1)^3\,dx`}<p>Use ${M`u=x^2+1`}, so ${M`du=2x\,dx`}. Integrate ${M`u^3`} and substitute back to obtain ${M`(x^2+1)^4/4+C`}.</p><div class="tip"><b>Find</b> an antiderivative: check it by differentiation. Integration by parts is not required in this SL topic.</div>`)],
lab('Reverse the chain',[
['Integrate cos(3x).','One third of sin(3x), plus C','Three times sin(3x), plus C','Differentiating sin(3x) introduces a factor of 3, so divide by 3.'],
['Integrate 2x(x² + 1)⁴.','Use u = x² + 1','Use u = 2x alone','The inside derivative 2x is already present.'],
['A proposed integral of sin x is cos x.','A minus sign is missing','It is correct because both are waves','The derivative of cos x is −sin x.']]),
w('Integrate a composite rate',F`\int2x(x^2+1)^3\,dx`,[
['Choose a substitution.',F`u=x^2+1,\quad du=2x\,dx`],
['Integrate in u.',F`\int u^3\,du=u^4/4+C`],
['Substitute back and check.',F`(x^2+1)^4/4+C`+'<p>Differentiation reproduces the original integrand by the chain rule.</p>']],
'A substitution must account for the whole integrand, including its differential.'),[
m('An antiderivative of sin x is…',['cos x + C','−cos x + C','−sin x + C','sin x + C'],1,'Differentiating −cos x gives sin x.'),
t('The power integral formula works unchanged for exponent −1.',false,'It would divide by zero; the antiderivative is logarithmic.'),
n('Find the coefficient.'+tbl(['Integrand','Antiderivative','k'],[['cos(2x)','k sin(2x) + C',A(0.5,true)]]),0.5,'Differentiation multiplies by 2, so integration divides by 2.'),
m('For 2x(x² + 1)³, choose a useful substitution.',['u = x² + 1','u = x + 1','u = 3x','u = 1/x'],0,'Its differential is du = 2x dx, matching the remaining factor.'),
n('An antiderivative is e³ˣ + C. Its value at x = 0 is 5. Find C.',4,'At zero, e⁰ = 1, so 5 = 1 + C.'),
t('Differentiating a proposed antiderivative checks the answer.',true,'It must give the original integrand on the relevant domain.')],
'Explain why a linear inner coefficient multiplies during differentiation but divides during integration.'),

s('5.11','Definite integrals and areas','evaluate integrals analytically and find areas with sign changes or between curves.',
'LineLab needs the material between two ramp profiles. A signed integral can cancel positive and negative contributions, but material cannot have negative area. Choose bounds and curve order before calculating.',[
c('Evaluate at the bounds',`<p>The <b>fundamental theorem of calculus</b> links a [[definite integral]] to an [[antiderivative]].</p>${F`\int_a^b f(x)\,dx=F(b)-F(a),\quad F'=f`}<div class="example">For f(x) = x from 0 to 2, evaluate ${M`x^2/2`} at 2 and subtract its value at 0, giving 2.</div>`),
c('Area is nonnegative','<p><b>Geometric area</b> is nonnegative. A signed integral counts below-axis contributions negatively. Split at axis crossings and add magnitudes to obtain area.</p><p>A signed integral of zero can mean equal positive and negative contributions rather than no enclosed area.</p>'),
c('Area between curves',`${F`A=\int_a^b(\text{upper}-\text{lower})\,dx`}<p>Find intersections for the bounds and to see where the curves switch order. Split the interval if required.</p><div class="example">For ${M`y=2x`} and ${M`y=x^2`}, intersections occur at x = 0 and 2, and the line is above the parabola in between.</div><div class="tip"><b>Find the area</b>: write the correct bounded integral first. Some definite integrals require technology; do not invent an antiderivative.</div>`)],
lab('Plan the material calculation',[
['The curve stays below the axis.','Negate its signed integral for area','Keep a negative geometric area','Geometric area is nonnegative.'],
['Two profiles switch which is above halfway through.','Split at the crossing','Use one fixed order throughout','Upper minus lower needs the appropriate ordering in each piece.'],
['An antiderivative is F, with bounds a to b.','Compute F(b) minus F(a)','Compute F(a) minus F(b)','Subtract the lower evaluation from the upper evaluation.']]),
w('Material between two profiles',F`y=2x,\quad y=x^2`,[
['Find the intersections.',F`2x=x^2\Rightarrow x=0,2`],
['Set up upper minus lower.',F`A=\int_0^2(2x-x^2)\,dx`],
['Evaluate.',F`A=[x^2-x^3/3]_0^2=4-8/3=4/3`]],
'Find the intersections, check which curve is above and use square units for geometric area.'),[
m('The signed integral of a negative function is…',['positive','negative','necessarily zero','undefined'],1,'Below-axis contributions enter the integral negatively.'),
t('A zero definite integral proves geometric area is zero.',false,'Positive and negative signed contributions can cancel.'),
n('Complete the definite-integral table.'+tbl(['Function','Bounds','Integral'],[['x²','0 to 3',A(9,true)]]),9,'Evaluate x³/3 at 3 and subtract its value at 0.'),
m('For area between two curves, integrate…',['upper plus lower','lower minus upper','upper minus lower','upper times lower'],2,'The strip height is the upper curve’s value minus the lower curve’s value.'),
n('Find the area between y = x and the axis from x = −1 to x = 1.',1,'Split at zero: two triangles each have area 1/2, giving 1.'),
n('Find the area between y = 2x and y = x² over 0 ≤ x ≤ 2, to three decimal places.',1.333,'Integrate 2x − x² to get 4 − 8/3 = 4/3, approximately 1.333.')],
'Text a mate why upper minus lower and splitting at crossings prevent impossible negative areas.')
],formulas:[
{group:'5.1–5.4 Derivatives and lines',items:[
{name:'Derivative as a limit',f:M`f'(x)=\lim_{h\to0}\frac{f(x+h)-f(x)}h`,note:'Conceptual definition; formal limit proofs are not required at SL.'},
{name:'Power rule',f:M`(ax^n)'=anx^{n-1}`},
{name:'Tangent equation',f:M`y-y_0=f'(x_0)(x-x_0)`},
{name:'Normal gradient',f:M`m_n=-1/m_t`,note:'For finite nonzero tangent gradients; a horizontal tangent has a vertical normal.'}]},
{group:'5.6–5.8 Differentiation toolkit',items:[
{name:'Chain rule',f:M`[f(g(x))]'=f'(g(x))g'(x)`},
{name:'Product rule',f:M`(uv)'=u'v+uv'`},
{name:'Quotient rule',f:M`(u/v)'=\frac{u'v-uv'}{v^2}`},
{name:'Sine and cosine',f:M`(\sin x)'=\cos x,\quad(\cos x)'=-\sin x`,note:'Angles in radians.'},
{name:'Exponential and logarithm',f:M`(e^x)'=e^x,\quad(\ln x)'=1/x`},
{name:'Second derivative',f:M`f''(x)=d^2y/dx^2`}]},
{group:'5.5, 5.9–5.11 Integrals and motion',items:[
{name:'Power integral',f:M`\int x^n\,dx=\frac{x^{n+1}}{n+1}+C`,note:'n ≠ −1.'},
{name:'Sine integral',f:M`\int\sin x\,dx=-\cos x+C`},
{name:'Cosine integral',f:M`\int\cos x\,dx=\sin x+C`},
{name:'Exponential integral',f:M`\int e^x\,dx=e^x+C`},
{name:'Reciprocal integral',f:M`\int\frac1x\,dx=\ln|x|+C`,note:'x ≠ 0.'},
{name:'Definite integral',f:M`\int_a^b f(x)\,dx=F(b)-F(a),\quad F'=f`},
{name:'Motion derivatives',f:M`v=ds/dt,\quad a=dv/dt`},
{name:'Total distance',f:M`D=\int_{t_1}^{t_2}|v(t)|\,dt`},
{name:'Area between curves',f:M`A=\int_a^b(\text{upper}-\text{lower})\,dx`,note:'Split at crossings if the order changes.'}]}]};

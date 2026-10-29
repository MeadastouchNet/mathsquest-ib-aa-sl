import { lesson, mc, num, tf, F, M, tbl, A } from './lesson.js';
import { SCI_KEYS } from '../calc.js';
// Verified: official guide SL2.1–SL2.11. Case: Noor and Emil plan a festival pop-up.
export const unit2={id:'2',title:'Functions',emoji:'ƒ',calcKeys:SCI_KEYS,
blurb:'Plan Noor and Emil’s festival pop-up: turn prices, crowds and costs into functions, graphs and decisions.',sections:[
lesson('2.1','Straight lines',
'Noor and Emil pay a fixed booking fee and a charge per ticket. A graph can separate those two costs. Its slope measures the extra cost of one more ticket. How can you write a rule from just two points?',[
['Gradient and intercept',`${F`y=mx+c,\quad m=\frac{y_2-y_1}{x_2-x_1}`}<p>The <b>gradient</b> measures change in y per unit increase in x. The y-intercept c is the value when x=0.</p><div class="example">Cost C(n)=3n+20 has fixed cost 20 kr and a 3 kr cost per ticket.</div>`],
['Other forms',`${F`y-y_1=m(x-x_1)`}<p>Point-gradient form uses a known point. A line can also be written ax+by+d=0. A vertical line x=k has undefined gradient.</p>`],
['Parallel and perpendicular',`${F`m_1=m_2\text{ (parallel)},\quad m_1m_2=-1\text{ (perpendicular)}`}<p>The product rule applies to two non-vertical lines with finite gradients. Horizontal and vertical lines are perpendicular.</p><div class="tip">Show the gradient calculation and then substitute a point to find the intercept. Include units when interpreting a slope.</div>`]
],['A ticket cost rule',tbl(['Tickets n','Cost (kr)'],[['0','20'],['10','50']]),['What is the slope?',F`m=(50-20)/(10-0)=3`],['Find the intercept.','At n=0 the cost is 20, so c=20.'],['Write and check the model.',F`C(n)=3n+20,\quad C(10)=50`]],[
mc('Which describes the gradient of C(n)=3n+20?',['20 kr per ticket','3 kr per ticket','3 tickets per kr','20 tickets per kr'],1,'It is the added cost per extra ticket.'),
mc('A line has gradient 2. Which gradient is perpendicular?',['2','−2','0.5','−0.5'],3,'Their product must be −1.'),
num('Find the gradient.'+tbl(['x','y'],[['1','5'],['4','14']]),3,'(14−5)/(4−1) = 3.'),
num('Find C(12) when C(n)=3n+20.',56,'3 × 12 + 20 = 56.'),tf('A vertical line has gradient zero.',false,'A vertical line has undefined gradient. A horizontal line has zero gradient.'),
num('A line has gradient 3 and passes through (2,11). Find its y-intercept.',5,'11 = 3(2)+c, so c=5.')
],'form a line equation and interpret its gradient.'),
lesson('2.2','Functions, domain and range',
'The pop-up’s ticket machine gives one price for every permitted ticket count. Some inputs are impossible: you cannot buy a negative number of tickets. Its output also has limits. What information does a function need beyond its formula?',[
['One output per input',`<p>A <b>function</b> assigns exactly one output to each input in its domain. Function notation f(x) means the output at x, not f multiplied by x.</p>${F`f(x)=2x+5,\quad f(3)=11`}`],
['Domain and range',`<p>The <b>domain</b> is the set of permitted inputs; the <b>range</b> is the set of outputs reached. Context can restrict both.</p><div class="example">For f(x)=x² on −2≤x≤3, the range is 0≤f(x)≤9, because zero occurs inside the interval.</div>`],
['Undo a function',`<p>An inverse reverses a one-to-one function. Its graph reflects in y=x; its domain is the original range.</p>${F`f(x)=2x+5\implies f^{-1}(x)=\frac{x-5}2`}<div class="tip">Do not interpret inverse notation as a reciprocal. State contextual restrictions, such as whole non-negative ticket counts.</div>`]
],['A restricted square','Find the range of f(x)=x² on −2≤x≤3.', ['Check the endpoints.','f(−2)=4 and f(3)=9.'],['Check inside the interval.','f(0)=0 is the minimum.'],['State the full range.',F`0\le f(x)\le9`]],[
mc('Which can be a function?',['One input gives two prices','Every input gives one price','Some inputs give no price in the stated domain','One input gives all prices'],1,'Every domain element must have exactly one output.'),
mc('The domain of 1/(x−2) excludes which value?',['0','1','2','−2'],2,'The denominator is zero at x=2.'),
num('Find f(4) if f(x)=2x+5.',13,'2(4)+5=13.'),num('Find the minimum of x² on −2≤x≤3.',0,'x=0 is in the domain and gives zero.'),
tf('The inverse function always equals the reciprocal function.',false,'Undoing an operation differs from dividing one by its output.'),num('Find f⁻¹(13) for f(x)=2x+5.',4,'(13−5)/2 = 4.')
],'identify a function’s domain, range and inverse.'),
lesson('2.3','Sketching graphs with technology',
'Emil enters a cost model into a graphing calculator and sees an empty screen. The rule might be right while the viewing window is wrong. A good sketch communicates the important behaviour without copying every pixel. Which features should survive the move from screen to paper?',[
['Choose a useful window',`<p>A graph displays input-output pairs. Begin with a table and a window that includes meaningful inputs and outputs.</p><div class="example">For y=x²−4, a window from −4 to 4 horizontally and −5 to 12 vertically shows both intercepts and the turning point.</div>`],
['Sketch versus draw',`<p>A <b>sketch</b> shows the correct shape and key features. A draw instruction requires an accurate diagram or graph, with an appropriate scale. Both need labelled axes and relevant coordinates.</p>`],
['Combine functions',`${F`(f+g)(x)=f(x)+g(x)`}<p>Add or subtract the outputs at the same input. Use your GDC to graph unfamiliar functions too, then interpret the result.</p><div class="tip">A blank screen is not evidence of no graph. Check the window, domain and expression before making conclusions.</div>`]
],['From table to sketch',tbl(['x','x²−4'],[['−2','0'],['0','−4'],['2','0']]),['What shape is expected?','An upward-opening parabola.'],['Which features must be labelled?','Intercepts (−2,0), (2,0), (0,−4); vertex (0,−4).'],['What window is sensible?','For example x from −4 to 4, y from −5 to 12. Include labelled axes.']], [
mc('A graph is invisible. What should you check first?',['Assume no solutions','Delete the function','Window and expression','Change every coefficient'],2,'The graph may lie outside the displayed window.'),
mc('What must a useful sketch include?',['Only the colour','Only a title','Every screen pixel','Axes and key features'],3,'The shape, axes and relevant coordinates communicate the mathematics.'),
num('For f(x)=x²−4, find f(0).',-4,'Substitute zero: 0²−4=−4.'),num('If f(2)=5 and g(2)=3, find (f+g)(2).',8,'At the same input add the outputs: 5+3.'),
tf('A sketch requires no axis labels.',false,'Axes and important coordinates should be labelled.'),num('Find the positive x-intercept of y=x²−4.',2,'Set y=0, so x²=4; the positive root is 2.')
],'use a graphing window and transfer a useful sketch to paper.'),
lesson('2.4','Graph features and intersections',
'Revenue and cost are two different rules for the same ticket count. Their intersection is where the two amounts match. A graph may also have a highest point or a boundary it approaches. Which features answer the business question?',[
['Intercepts and turning points',`<p>A zero is an x-value where the output is zero. The y-intercept comes from x=0. A maximum or minimum concerns the output value; its location is an input.</p><div class="example">For y=−(x−3)²+9, the maximum output is 9 at x=3.</div>`],
['Intersections',`${F`f(x)=g(x)`}<p>An <b>intersection</b> has matching outputs and is reported as a coordinate pair. A GDC intersection tool needs a suitable interval or window.</p>`],
['Asymptotes and context',`<p>An <b>asymptote</b> describes limiting graph behaviour. For y=1/x, x=0 is vertical and y=0 is horizontal. It is not an intercept.</p><div class="tip">If asked how many tickets break even, report the input with units, not just the matching money value. Reject intersections outside the contextual domain.</div>`]
],['Break even', 'Revenue is R(x)=8x and cost is C(x)=3x+100.', ['Set the outputs equal.',F`8x=3x+100`],['Solve for the input.',F`5x=100\implies x=20`],['Find and interpret the point.',F`R(20)=160\implies(20,160)`+'<p>Twenty tickets break even at 160 kr.</p>']], [
mc('What equation locates the intersection?',['f(x)=0','g(x)=0','f(x)=g(x)','f(0)=g(0)'],2,'Matching outputs at the same input define the intersection.'),
mc('What is the maximum value of −(x−3)²+9?',['−3','3','0','9'],3,'A non-negative square is subtracted from 9.'),
num('Find break-even tickets for revenue 8x and cost 3x+100.',20,'8x = 3x + 100, so x = 20.'),num('Find the y-coordinate where R(x)=8x intersects C(x)=3x+100.',160,'8 × 20 = 160.'),
tf('An x-intercept always has y-coordinate zero.',true,'It lies on the x-axis.'),num('Find the x-coordinate of the vertex of −(x−3)²+9.',3,'The square is zero at x=3.')
],'identify graph features and interpret intersections.'),
lesson('2.5','Composite and inverse functions',
'One function discounts a ticket; another adds a booking fee. Applying them in different orders can change the final price. An inverse operation could recover the original price. How do you keep the order straight?',[
['Composition',`${F`(f\circ g)(x)=f(g(x))`}<p>A <b>composite function</b> applies the inner function first. If f(x)=2x+1 and g(x)=x², then f(g(x))=2x²+1, while g(f(x))=(2x+1)².</p>`],
['Find the inverse',`<p>Write y=f(x), swap x and y, then solve for y. Check that reversing is possible on the chosen domain.</p>${F`y=2x+1\implies x=2y+1\implies y=\frac{x-1}2`}`],
['Identity and restrictions',`${F`f(f^{-1}(x))=x`}<p>This works on the domain where the composition is defined. Squaring on all real numbers is not one-to-one; restricting x to non-negative values allows the square-root inverse.</p><div class="tip">Track domain restrictions through both functions. The identity function returns the original input.</div>`]
],['Order matters','Let f(x)=2x+1 and g(x)=x². Find f(g(3)).',['Evaluate the inner function.',F`g(3)=9`],['Apply the outer function.',F`f(9)=19`],['Compare with the reverse order.',F`g(f(3))=g(7)=49`]], [
mc('In f(g(x)), which acts first?',['f','g','Both at once','Neither'],1,'Work from the innermost expression outwards.'),
mc('Which is the inverse of 2x+1?',['2x−1','1/(2x+1)','(x−1)/2','(x+1)/2'],2,'Reverse adding one, then reverse multiplying by two.'),
num('Find f(g(3)) for f(x)=2x+1, g(x)=x².',19,'g(3)=9 then f(9)=19.'),num('Find g(f(3)) for f(x)=2x+1 and g(x)=x².',49,'f(3)=7 then g(7)=49.'),
tf('Every function on the real numbers has an inverse function.',false,'It must be one-to-one on its stated domain.'),num('Find f⁻¹(15) if f(x)=2x+1.',7,'(15−1)/2=7.')
],'compose functions in order and find an inverse.'),
lesson('2.6','Quadratic functions',
'A pop-up’s projected profit first rises and then falls as the price increases. The model is a parabola. Different forms reveal the intercepts or the best price immediately. Can you choose the form that answers the question fastest?',[
['Three useful forms',`${F`f(x)=ax^2+bx+c`} ${F`f(x)=a(x-p)(x-q)`} ${F`f(x)=a(x-h)^2+k`}<p>A <b>quadratic function</b> has a non-zero squared coefficient. The expanded form shows the y-intercept; factors show roots; vertex form shows (h,k).</p>`],
['Vertex and symmetry',`${F`x=-\frac b{2a}`}<p>The axis of symmetry passes through the vertex. Positive a opens upwards; negative a opens downwards.</p><div class="example">−(x−4)²+16 has maximum 16 at x=4.</div>`],
['Complete the square',`${F`x^2-6x+5=(x-3)^2-4`}<p>Add and subtract the same number to preserve the expression. Expand back to check.</p><div class="tip">Give coordinates for a vertex, and the output value when asked for the minimum or maximum value.</div>`]
],['Reveal the vertex','Rewrite x²−6x+5 in vertex form.',['Complete the first square.',F`(x-3)^2=x^2-6x+9`],['Correct the constant.',F`x^2-6x+5=(x-3)^2-4`],['Read the vertex and roots.','Vertex (3,−4); factors (x−1)(x−5) give roots 1 and 5.']], [
mc('Which form reveals roots directly?',['ax²+bx+c','a(x−p)(x−q)','a(x−h)²+k','a/x+b'],1,'A product is zero when one factor is zero.'),
mc('For y=−(x−4)²+16, which is the vertex?',['(−4,16)','(4,−16)','(4,16)','(16,4)'],2,'Read h=4 and k=16 from vertex form.'),
num('Find the y-intercept of x²−6x+5.',5,'Set x=0.'),num('Find the minimum value of x²−6x+5.',-4,'The square form is (x−3)²−4.'),
tf('All quadratic functions have two distinct real roots.',false,'A parabola may touch the axis once or never intersect it.'),num('Find the axis-of-symmetry x-value for x²−6x+5.',3,'−b/(2a)=6/2=3.')
],'switch quadratic forms to reveal roots and a vertex.'),
lesson('2.7','Quadratic equations and inequalities',
'The profit model says some ticket prices make a loss. Finding break-even prices is only the first step: the profitable prices form an interval. A discriminant tells you how many boundaries exist. How do you move from roots to a complete inequality solution?',[
['Solve an equation',`${F`ax^2+bx+c=0\implies x=\frac{-b\pm\sqrt{b^2-4ac}}{2a}`}<p>Try factorisation when simple; completing the square also works. Keep exact roots when asked.</p>`],
['Count real roots',`<p>The <b>discriminant</b> predicts real solutions.</p>${F`\Delta=b^2-4ac`}<p>Positive gives two distinct real roots; zero gives one repeated root; negative gives no real roots.</p>`],
['Solve inequalities',`<p>Find the roots, sketch the parabola or test intervals, then select where the sign matches. Strict inequalities exclude roots; inclusive inequalities include them.</p><div class="tip">Do not merely list roots when the question asks for an interval. If a coefficient contains a parameter, check whether the quadratic coefficient could become zero.</div>`]
],['Choose the profitable interval','Solve x²−6x+5 &lt; 0.',['Factorise.',F`(x-1)(x-5)<0`],['Test between the roots.','At x=3, the product is (2)(−2)=−4, which is negative.'],['State the solution.',F`1<x<5`]], [
mc('A negative discriminant means what?',['Two real roots','One repeated root','No real roots','Two positive roots'],2,'The square root of a negative number is not real.'),
mc('Where is (x−1)(x−5) negative?',['x < 1','1 < x < 5','x > 5','All real x'],1,'The factors have opposite signs between the roots.'),
num('Find the discriminant of x²−6x+5.',16,'(−6)²−4(1)(5)=16.'),num('Find the larger root of x²−6x+5=0.',5,'It factorises to (x−1)(x−5)=0.'),
tf('A repeated real root occurs when the discriminant is zero.',true,'The plus and minus square-root terms then agree.'),num('Find the repeated root of x²−4x+4=0.',2,'(x−2)²=0.')
],'solve quadratic equations and describe inequality intervals.'),
lesson('2.8','Reciprocal and rational functions',
'The fixed cost per person falls as more people share the pop-up fee. It never becomes exactly zero for a finite crowd. A rational function captures this behaviour and the impossible zero-person input. Which lines describe its limiting behaviour?',[
['Reciprocal',`${F`f(x)=\frac1x,\quad x\ne0`}<p>The <b>reciprocal function</b> is self-inverse. Its graph has vertical asymptote x=0 and horizontal asymptote y=0.</p>`],
['Linear-over-linear functions',`${F`f(x)=\frac{ax+b}{cx+d}`}<p>For c non-zero and no cancellation, the vertical asymptote is x=−d/c and horizontal asymptote y=a/c. A cancelled common factor creates a hole rather than a vertical asymptote.</p>`],
['Interpret a model',`${F`C(n)=\frac{100}{n}+3`}<p>The average cost approaches 3 kr as positive n grows. In context n is a positive integer.</p><div class="tip">Never substitute a denominator-zero input. A horizontal asymptote describes end behaviour; other rational graphs can cross one.</div>`]
],['Read the asymptotes','Find the key features of f(x)=(2x+1)/(x−3).',['Find the excluded input.',F`x-3=0\implies x=3`],['Compare leading coefficients.','The horizontal asymptote is y=2.'],['Find intercepts.','The x-intercept is (−0.5,0); y-intercept is (0,−1/3).']], [
mc('Where is the vertical asymptote of (2x+1)/(x−3)?',['x=−3','x=3','y=2','y=3'],1,'The denominator is zero at x=3 and the numerator is non-zero there.'),
mc('What is its horizontal asymptote?',['y=0','y=1','y=2','x=2'],2,'The leading-coefficient ratio is 2/1.'),
num('Find 100/n+3 at n=20.',8,'100/20+3=8.'),num('Find the x-intercept of (2x+1)/(x−3).',-0.5,'Set the numerator to zero while keeping the denominator non-zero.'),
tf('1/x is defined at x=0.',false,'Division by zero is undefined.'),num('Find f(f(4)) when f(x)=1/x.',4,'The reciprocal of the reciprocal returns 4.')
],'identify rational-function restrictions and asymptotes.'),
lesson('2.9','Exponential and logarithmic functions',
'At first the pop-up’s online audience grows by a fixed percentage each day. The graph becomes steeper even though the percentage stays fixed. Reversing it turns audience into elapsed time. How do the two graphs fit together?',[
['Exponential graphs',`${F`f(x)=a^x\quad(a>0,\ a\ne1)`}<p>When a&gt;1 the graph increases; when 0&lt;a&lt;1 it decreases. Domain is all real x, range is positive and y-intercept is 1.</p>`],
['Logarithmic graphs',`${F`g(x)=\log_a x`}<p>A logarithmic graph is the inverse reflection of an exponential graph in y=x. Domain is positive x; range is all real numbers; it passes through (1,0).</p>`],
['Natural base and equivalence',`${F`a^x=e^{x\ln a},\quad\ln(e^x)=x`}<p>For y=Aeᵏᵗ with A positive, k&gt;0 gives growth and k&lt;0 gives decay. A is the initial amount.</p><div class="tip">Distinguish a vertical asymptote of a log graph from a horizontal asymptote of its exponential inverse. Link to [[logarithm]] rules when solving.</div>`]
],['Audience model','Let N(t)=200(2ᵗ), with t in days.',['Find the starting audience.',F`N(0)=200`],['Find the audience after three days.',F`N(3)=200(8)=1600`],['Write the inverse time rule.',F`t=\log_2(N/200)`]], [
mc('What is the domain of ln x?',['All real x','x ≥ 0','x > 0','x < 0'],2,'Only positive real arguments have a real natural logarithm.'),
mc('Which graph decreases as x increases?',['2ˣ','eˣ','3ˣ','(0.5)ˣ'],3,'A base between zero and one gives exponential decay.'),
num('Find N(3) for N(t)=200(2ᵗ).',1600,'200 × 8 = 1,600.'),num('Find ln(e⁴).',4,'Natural logarithm and exponential with base e undo each other.'),
tf('The graph of y=2ˣ has an x-intercept.',false,'Its output is always positive.'),num('Find the y-intercept of y=5eˣ.',5,'At x=0, e⁰=1.')
],'connect exponential graphs with their logarithmic inverses.'),
lesson('2.10','Solving equations and modelling',
'Noor needs the day when an audience target is reached. Some equations rearrange neatly; others require a numerical solver. A solution still needs checking against the original model. How can a graph and algebra support one another?',[
['Analytical methods',`<p>An <b>analytical solution</b> uses algebra to obtain an exact result. Factorise, substitute or take logarithms as appropriate.</p>${F`e^{2x}-5e^x+4=0`}<p>Set u=eˣ to get u²−5u+4=0. Then u=1 or 4 gives x=0 or ln 4.</p>`],
['Graphical and numerical methods',`<p>Find roots of f(x)−g(x), or intersections of y=f(x) and y=g(x). Use a sensible search interval; an automatic solver can find only one of several roots.</p>`],
['Interpret and verify',`<p>Substitute every candidate back into the original equation. Reject impossible times, denominator-zero inputs or values outside the model’s domain.</p><div class="tip">Show the equation solved and enough working to communicate the method. Round a continuous time to the next integer only if the question asks for the first whole period reaching a target.</div>`]
],['Audience target','Find t when 200(2ᵗ)=1000.',['Isolate the exponential.',F`2^t=5`],['Take logs.',F`t=\frac{\ln5}{\ln2}\approx2.32`],['Interpret whole days.','The model reaches the target at about 2.32 days. The first whole-number day at or above the target is day 3.']], [
mc('Which substitution simplifies e²ˣ−5eˣ+4=0?',['u=x²','u=eˣ','u=ln x','u=2x'],1,'Then e²ˣ=u², producing a quadratic in u.'),
mc('How can f(x)=g(x) be solved graphically?',['Find y-intercepts','Find only maxima','Find intersections','Find only asymptotes'],2,'Both functions have the same output at an intersection.'),
num('Solve 200(2ᵗ)=1000; enter t to three significant figures.',Math.log2(5),'2ᵗ=5, so t=ln5/ln2 ≈2.32.',0.005),
num('Find the first whole-number day with 200(2ᵗ)≥1000.',3,'Day 2 gives 800; day 3 gives 1,600.'),
tf('A single root from a numerical solver proves there are no other roots.',false,'Search intervals and graph windows can hide other solutions.'),num('Find the smaller solution of e²ˣ−5eˣ+4=0.',0,'eˣ is 1 or 4; the smaller x is ln1=0.')
],'choose an equation-solving method and interpret its result.'),
lesson('2.11','Transformations of graphs',
'Emil moves a graph sideways to fit the pop-up’s data. Changing x inside a function shifts it in a direction that can feel backwards. Multiplying outside changes heights; multiplying inside changes widths. Can you predict a new graph without plotting every point?',[
['Translations',`${F`y=f(x-h)+k`}<p>A <b>translation</b> moves the graph h units right and k units up. Inside subtraction gives a right shift because the old input zero now occurs at x=h.</p>`],
['Reflections and stretches',`${F`y=-f(x),\quad y=f(-x)`}<p>These reflect in the x-axis and y-axis respectively.</p>${F`y=pf(x),\quad y=f(qx)`}<p>The first scales heights by p; for positive q, the second scales horizontal distances by 1/q.</p>`],
['Combine carefully',`<p>For y=2f(x−3)+1, a point (a,b) becomes (a+3,2b+1). Tracking points avoids ambiguous order descriptions.</p><div class="tip">For y=f(2x), call the horizontal scale factor 1/2. Use the function input, not the visual guess, to decide the direction.</div>`]
],['Move a point','A point (2,5) lies on y=f(x). Find its image on y=2f(x−3)+1.',['Match the old input.',F`x-3=2\implies x=5`],['Transform the old output.',F`y=2(5)+1=11`],['State the new coordinate.','The image is (5,11).']], [
mc('How does f(x−3) move the graph?',['Three left','Three right','Three up','Three down'],1,'The same old input occurs three units later.'),
mc('What is the horizontal scale factor for f(2x)?',['2','−2','1/2','−1/2'],2,'To reach the same input, x is halved.'),
num('A point has x=2. Find its new x-coordinate under y=f(x−3).',5,'Set x−3=2.'),num('A point has y=5. Find its new y-coordinate under y=2f(x)+1.',11,'2(5)+1=11.'),
tf('−f(x) reflects a graph in the y-axis.',false,'It changes output signs, reflecting in the x-axis.'),num('Find the minimum of y=2(x−3)²+1.',1,'The squared part is non-negative and is zero at x=3.')
],'predict translations, reflections and stretches using points.')
],formulas:[{group:'Lines and quadratics',items:[{name:'Gradient',f:M`m=\frac{y_2-y_1}{x_2-x_1}`},{name:'Point-gradient form',f:M`y-y_1=m(x-x_1)`},{name:'Quadratic formula',f:M`x=\frac{-b\pm\sqrt{b^2-4ac}}{2a}`},{name:'Vertex form',f:M`y=a(x-h)^2+k`}]},{group:'Functions',items:[{name:'Composition',f:M`(f\circ g)(x)=f(g(x))`},{name:'Transformation of a point',f:M`y=pf(q(x-h))+k`,note:'Enrichment beyond the required individual SL transformations. For non-zero q: (a,b) maps to (a/q+h,pb+k). Practice aid; not a replacement for the official formula booklet.'}]}]};

unit2.sections[5].labs.push({type: 'parabola'});
unit2.sections[6].cards.push({title:'A parameter in the discriminant',html:`<p>For x²+kx+4=0, two distinct real roots require a positive discriminant.</p>${F`\Delta=k^2-16>0\implies k<-4\text{ or }k>4`}<p>At k=±4 the root is repeated. Between −4 and 4 there are no real roots.</p>`});
unit2.sections[6].quiz.push({id:'2.7-7',...mc('For x²+kx+4=0, which k gives a repeated root?',['0','2','4','6'],2,'The discriminant is k²−16. It vanishes when k=±4; 4 is the offered solution.')});
unit2.sections[9].cards.push({title:'When algebra does not isolate x',html:`<p>Solve x³−x−1=0 numerically. Plot y=x³−x−1 in a window containing x from 0 to 2 and y from −2 to 6. The graph changes sign between x=1 and x=2.</p><p>Use the root tool on that interval to obtain about 1.324717957. Substitution gives a value close to zero. Report x≈1.32 to three significant figures, while retaining the unrounded root in any later calculation.</p>`});
unit2.sections[9].quiz.push({id:'2.10-7',...num('Use your GDC to find the real root of x³−x−1=0, to three significant figures.',1.324717957,'A root tool on [1,2] gives 1.324717957…; substitute to check the residual is near zero.',0.005)});
